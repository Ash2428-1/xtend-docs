import { ORGANISATION_MEMBER_ROLE_PERMISSIONS_MAP } from '@documenso/lib/constants/organisations';
import { AppError, AppErrorCode } from '@documenso/lib/errors/app-error';
import type { FindResultResponse } from '@documenso/lib/types/search-params';
import { buildOrganisationWhereQuery } from '@documenso/lib/utils/organisations';
import { prisma } from '@documenso/prisma';
import type { OrganisationMemberInviteStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

import { authenticatedProcedure } from '../trpc';
import {
  ZFindOrganisationMemberInvitesRequestSchema,
  ZFindOrganisationMemberInvitesResponseSchema,
} from './find-organisation-member-invites.types';

export const findOrganisationMemberInvitesRoute = authenticatedProcedure
  //   .meta(getOrganisationMemberInvitesMeta)
  .input(ZFindOrganisationMemberInvitesRequestSchema)
  .output(ZFindOrganisationMemberInvitesResponseSchema)
  .query(async ({ input, ctx }) => {
    const { organisationId, query, page, perPage, status } = input;
    const { user } = ctx;

    ctx.logger.info({
      input: {
        organisationId,
      },
    });

    return await findOrganisationMemberInvites({
      userId: user.id,
      organisationId,
      query,
      page,
      perPage,
      status,
    });
  });

type FindOrganisationMemberInvitesOptions = {
  userId: number;
  organisationId: string;
  query?: string;
  page?: number;
  perPage?: number;
  status?: OrganisationMemberInviteStatus;
};

export const findOrganisationMemberInvites = async ({
  userId,
  organisationId,
  query,
  page = 1,
  perPage = 10,
  status,
}: FindOrganisationMemberInvitesOptions) => {
  const organisation = await prisma.organisation.findFirst({
    where: buildOrganisationWhereQuery({
      organisationId,
      userId,
      roles: ORGANISATION_MEMBER_ROLE_PERMISSIONS_MAP['MANAGE_ORGANISATION'],
    }),
  });

  if (!organisation) {
    throw new AppError(AppErrorCode.NOT_FOUND);
  }

  const whereClause: Prisma.OrganisationMemberInviteWhereInput = {
    organisationId: organisation.id,
    status,
  };

  if (query) {
    whereClause.email = {
      contains: query,
      mode: Prisma.QueryMode.insensitive,
    };
  }

  const [data, count] = await Promise.all([
    prisma.organisationMemberInvite.findMany({
      where: whereClause,
      skip: Math.max(page - 1, 0) * perPage,
      take: perPage,
      orderBy: {
        createdAt: 'desc',
      },
      // Exclude token attribute.
      select: {
        id: true,
        organisationId: true,
        email: true,
        createdAt: true,
        organisationRole: true,
        status: true,
      },
    }),
    prisma.organisationMemberInvite.count({
      where: whereClause,
    }),
  ]);

  // xtend-docs: flag invites whose email already belongs to a user account.
  const existingUsers = data.length
    ? await prisma.user.findMany({
        where: {
          OR: data.map((invite) => ({
            email: { equals: invite.email, mode: Prisma.QueryMode.insensitive },
          })),
        },
        select: { email: true },
      })
    : [];

  const accountEmails = new Set(existingUsers.map((u) => u.email.toLowerCase()));

  const dataWithAccount = data.map((invite) => ({
    ...invite,
    hasAccount: accountEmails.has(invite.email.toLowerCase()),
  }));

  return {
    data: dataWithAccount,
    count,
    currentPage: Math.max(page, 1),
    perPage,
    totalPages: Math.ceil(count / perPage),
  } satisfies FindResultResponse<typeof dataWithAccount>;
};
