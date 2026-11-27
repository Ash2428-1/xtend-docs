import type { ExtendedDocumentStatus } from '@documenso/prisma/types/extended-document-status';
import { SignatureIcon } from '@documenso/ui/icons/signature';
import { cn } from '@documenso/ui/lib/utils';
import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { RecipientRole, SigningStatus } from '@prisma/client';
import { CheckCircle2, Clock, File, TimerOff, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react/dist/lucide-react';
import type { HTMLAttributes } from 'react';

type FriendlyStatus = {
  label: MessageDescriptor;
  labelExtended: MessageDescriptor;
  icon?: LucideIcon;
  color: string;
};

export const FRIENDLY_STATUS_MAP: Record<ExtendedDocumentStatus, FriendlyStatus> = {
  PENDING: {
    label: msg`Pending`,
    labelExtended: msg`Document pending`,
    icon: Clock,
    color: 'text-blue-600 dark:text-blue-300',
  },
  COMPLETED: {
    label: msg`Completed`,
    labelExtended: msg`Document completed`,
    icon: CheckCircle2,
    color: 'text-green-500 dark:text-green-300',
  },
  DRAFT: {
    label: msg`Draft`,
    labelExtended: msg`Document draft`,
    icon: File,
    color: 'text-yellow-500 dark:text-yellow-200',
  },
  REJECTED: {
    label: msg`Rejected`,
    labelExtended: msg`Document rejected`,
    icon: XCircle,
    color: 'text-red-500 dark:text-red-300',
  },
  CANCELLED: {
    label: msg`Cancelled`,
    labelExtended: msg`Document cancelled`,
    icon: XCircle,
    color: 'text-red-500 dark:text-red-300',
  },
  EXPIRED: {
    label: msg`Expired`,
    labelExtended: msg`Document expired`,
    icon: TimerOff,
    color: 'text-orange-500 dark:text-orange-300',
  },
  INBOX: {
    label: msg`Inbox`,
    labelExtended: msg`Document inbox`,
    icon: SignatureIcon,
    color: 'text-muted-foreground',
  },
  ALL: {
    label: msg`All`,
    labelExtended: msg`Document All`,
    color: 'text-muted-foreground',
  },
};

type RecipientProgress = { role: RecipientRole; signingStatus: SigningStatus };

export const isFinalizingDocument = (
  status: ExtendedDocumentStatus,
  recipients: readonly RecipientProgress[],
) =>
  status === 'PENDING' &&
  recipients.some(({ role, signingStatus }) => role !== RecipientRole.CC && signingStatus === SigningStatus.SIGNED) &&
  recipients.every(({ role, signingStatus }) => role === RecipientRole.CC || signingStatus === SigningStatus.SIGNED);

export type DocumentStatusProps = HTMLAttributes<HTMLSpanElement> & {
  status: ExtendedDocumentStatus;
  inheritColor?: boolean;
  recipients?: readonly RecipientProgress[];
};

export const DocumentStatus = ({
  className,
  status,
  inheritColor,
  recipients,
  ...props
}: DocumentStatusProps) => {
  const { _ } = useLingui();

  const { label, icon: Icon, color } = FRIENDLY_STATUS_MAP[status];
  const displayLabel =
    status === 'PENDING' && recipients
      ? isFinalizingDocument(status, recipients)
        ? msg`Finalizing PDF`
        : msg`Awaiting signatures`
      : label;

  return (
    <span className={cn('flex items-center', className)} {...props}>
      {Icon && (
        <Icon
          className={cn('mr-2 inline-block h-4 w-4', {
            [color]: !inheritColor,
          })}
        />
      )}
      {_(displayLabel)}
    </span>
  );
};
