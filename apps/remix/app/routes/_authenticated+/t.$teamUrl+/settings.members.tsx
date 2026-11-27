import { useCurrentOrganisation } from '@documenso/lib/client-only/providers/organisation';
import { canExecuteOrganisationAction } from '@documenso/lib/utils/organisations';
import { Input } from '@documenso/ui/primitives/input';
import { Trans, useLingui } from '@lingui/react/macro';
import { debounce, parseAsString, useQueryState } from 'nuqs';

import { TeamMemberCreateDialog } from '~/components/dialogs/team-member-create-dialog';
import { SettingsHeader } from '~/components/general/settings-header';
import { OrganisationMemberInvitesTable } from '~/components/tables/organisation-member-invites-table';
import { TeamMembersTable } from '~/components/tables/team-members-table';

export default function TeamsSettingsMembersPage() {
  const { t } = useLingui();
  const organisation = useCurrentOrganisation();

  const [searchQuery, setSearchQuery] = useQueryState(
    'query',
    parseAsString.withDefault('').withOptions({ shallow: false, limitUrlUpdates: debounce(500) }),
  );

  // xtend-docs: show the organisation's pending invitations here too.
  // Listing invites is limited to organisation admins/managers server-side, so only show it to them.
  const canViewInvites = canExecuteOrganisationAction(
    'MANAGE_ORGANISATION',
    organisation.currentOrganisationRole,
  );

  return (
    <div>
      <SettingsHeader hideDivider title={t`Team Members`} subtitle={t`Manage the members of your team.`}>
        <TeamMemberCreateDialog />
      </SettingsHeader>

      <Input
        value={searchQuery}
        onChange={(e) => void setSearchQuery(e.target.value || null)}
        placeholder={t`Search`}
        className="mb-4"
      />

      <TeamMembersTable />

      {canViewInvites && (
        <section className="mt-10">
          <h3 className="font-semibold text-lg">
            <Trans>Pending invites</Trans>
          </h3>
          <p className="mt-1 mb-4 text-muted-foreground text-sm">
            <Trans>
              People invited to the organisation who haven't accepted yet. Once they accept, you can add them to this
              team.
            </Trans>
          </p>

          <OrganisationMemberInvitesTable />
        </section>
      )}
    </div>
  );
}
