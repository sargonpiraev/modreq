import { type ReactNode } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Cookie,
  Globe,
  Plus,
  Trash2,
  Wrench,
} from 'lucide-react';

import { Button } from './components/button';
import { Input } from './components/input';
import { Label } from './components/label';
import { Switch } from './components/switch';
import { cn } from './lib/utils';
import type { CookieRule, HeaderRule } from './lib/types';

export type ModreqView =
  | { kind: 'home' }
  | { kind: 'pick-type' }
  | { kind: 'edit-header'; ruleId: string }
  | { kind: 'edit-cookie'; ruleId: string };

export type ModreqPopupProps = {
  loaded: boolean;
  headers: HeaderRule[];
  cookies: CookieRule[];
  view: ModreqView;
  onHeadersChange: React.Dispatch<React.SetStateAction<HeaderRule[]>>;
  onCookiesChange: React.Dispatch<React.SetStateAction<CookieRule[]>>;
  onViewChange: React.Dispatch<React.SetStateAction<ModreqView>>;
  onStartNewModification: (type: 'header' | 'cookie') => void;
  onApplyCookies?: () => void | Promise<void>;
};

export function ModreqPopup({
  loaded,
  headers,
  cookies,
  view,
  onHeadersChange,
  onCookiesChange,
  onViewChange,
  onStartNewModification,
  onApplyCookies,
}: ModreqPopupProps) {
  function updateHeader(id: string, patch: Partial<HeaderRule>) {
    onHeadersChange((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
    );
  }

  function updateCookie(id: string, patch: Partial<CookieRule>) {
    onCookiesChange((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)),
    );
  }

  const hasModifications = headers.length > 0 || cookies.length > 0;
  const editingHeader =
    view.kind === 'edit-header'
      ? headers.find((rule) => rule.id === view.ruleId)
      : undefined;
  const editingCookie =
    view.kind === 'edit-cookie'
      ? cookies.find((rule) => rule.id === view.ruleId)
      : undefined;

  if (!loaded) {
    return (
      <PopupFrame centerMain>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </PopupFrame>
    );
  }

  if (view.kind === 'pick-type') {
    return (
      <PopupFrame
        header={
          <ScreenHeader title="New modification" onBack={() => onViewChange({ kind: 'home' })} />
        }
      >
        <SectionIntro
          title="What do you want to change?"
          description="Pick a modification type. You can add more later."
        />
        <div className="mt-8 flex flex-col gap-4">
          <TypeOption
            icon={Globe}
            title="Request headers"
            description="Append a header to matching requests"
            flowTarget="pick-header"
            onClick={() => onStartNewModification('header')}
          />
          <TypeOption
            icon={Cookie}
            title="Cookie overwrite"
            description="Replace a cookie on the current site"
            flowTarget="pick-cookie"
            onClick={() => onStartNewModification('cookie')}
          />
        </div>
      </PopupFrame>
    );
  }

  if (view.kind === 'edit-header' && editingHeader) {
    return (
      <PopupFrame
        header={
          <ScreenHeader title="Request header" onBack={() => onViewChange({ kind: 'home' })} />
        }
        footer={
          <EditorActions
            onDelete={() => {
              onHeadersChange((current) =>
                current.filter((rule) => rule.id !== editingHeader.id),
              );
              onViewChange({ kind: 'home' });
            }}
            onDone={() => onViewChange({ kind: 'home' })}
          />
        }
      >
        <SectionIntro
          title="Append header"
          description="This header will be added to every matching request."
        />
        <RuleEditorFields className="mt-6">
          <Field label="Header name" htmlFor="header-name">
            <Input
              id="header-name"
              className="h-10"
              placeholder="X-Forwarded-For"
              value={editingHeader.name}
              onChange={(event) =>
                updateHeader(editingHeader.id, { name: event.target.value })
              }
            />
          </Field>
          <Field label="Header value" htmlFor="header-value">
            <Input
              id="header-value"
              className="h-10"
              placeholder="8.8.8.8"
              value={editingHeader.value}
              onChange={(event) =>
                updateHeader(editingHeader.id, { value: event.target.value })
              }
            />
          </Field>
          <ToggleRow
            id="header-enabled"
            label="Enabled"
            checked={editingHeader.enabled}
            onCheckedChange={(enabled) =>
              updateHeader(editingHeader.id, { enabled })
            }
          />
        </RuleEditorFields>
      </PopupFrame>
    );
  }

  if (view.kind === 'edit-cookie' && editingCookie) {
    return (
      <PopupFrame
        header={
          <ScreenHeader title="Cookie overwrite" onBack={() => onViewChange({ kind: 'home' })} />
        }
        footer={
          <EditorActions
            onDelete={() => {
              onCookiesChange((current) =>
                current.filter((rule) => rule.id !== editingCookie.id),
              );
              onViewChange({ kind: 'home' });
            }}
            onDone={() => {
              void onApplyCookies?.();
              onViewChange({ kind: 'home' });
            }}
            doneLabel="Save & apply"
          />
        }
      >
        <SectionIntro
          title="Replace cookie"
          description="Applies to the site in your active tab — no URL needed."
        />
        <RuleEditorFields className="mt-6">
          <Field label="Cookie name" htmlFor="cookie-name">
            <Input
              id="cookie-name"
              className="h-10"
              placeholder="session"
              value={editingCookie.name}
              onChange={(event) =>
                updateCookie(editingCookie.id, { name: event.target.value })
              }
            />
          </Field>
          <Field label="New value" htmlFor="cookie-value">
            <Input
              id="cookie-value"
              className="h-10"
              placeholder="replaced-value"
              value={editingCookie.value}
              onChange={(event) =>
                updateCookie(editingCookie.id, { value: event.target.value })
              }
            />
          </Field>
          <ToggleRow
            id="cookie-enabled"
            label="Enabled"
            checked={editingCookie.enabled}
            onCheckedChange={(enabled) =>
              updateCookie(editingCookie.id, { enabled })
            }
          />
        </RuleEditorFields>
      </PopupFrame>
    );
  }

  if (!hasModifications) {
    return (
      <PopupFrame header={<AppHeader title="modreq" />} centerMain>
        <EmptyState onAdd={() => onViewChange({ kind: 'pick-type' })} />
      </PopupFrame>
    );
  }

  return (
    <PopupFrame
      header={<AppHeader title="modreq" />}
      footer={
        <div className="space-y-4">
          <p className="px-2 text-center text-xs leading-5 text-muted-foreground">
            Active modifications apply automatically to matching requests.
          </p>
          <Button
            type="button"
            size="lg"
            className="h-11 w-full rounded-lg shadow-sm"
            data-flow-target="add-footer"
            onClick={() => onViewChange({ kind: 'pick-type' })}
          >
            <Plus className="size-4" />
            Add modification
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {headers.length > 0 && (
          <ModificationSection title="Request headers">
            {headers.map((rule) => (
              <RuleListItem
                key={rule.id}
                enabled={rule.enabled}
                primary={rule.name || 'Unnamed header'}
                secondary={rule.value || 'No value'}
                onToggle={(enabled) => updateHeader(rule.id, { enabled })}
                onOpen={() => onViewChange({ kind: 'edit-header', ruleId: rule.id })}
                onDelete={() =>
                  onHeadersChange((current) => current.filter((item) => item.id !== rule.id))
                }
              />
            ))}
          </ModificationSection>
        )}

        {cookies.length > 0 && (
          <ModificationSection title="Cookie overwrite">
            {cookies.map((rule) => (
              <RuleListItem
                key={rule.id}
                enabled={rule.enabled}
                primary={rule.name || 'Unnamed cookie'}
                secondary={rule.value || 'No value'}
                onToggle={(enabled) => updateCookie(rule.id, { enabled })}
                onOpen={() => onViewChange({ kind: 'edit-cookie', ruleId: rule.id })}
                onDelete={() =>
                  onCookiesChange((current) => current.filter((item) => item.id !== rule.id))
                }
              />
            ))}
          </ModificationSection>
        )}
      </div>
    </PopupFrame>
  );
}

function PopupFrame({
  header,
  footer,
  centerMain = false,
  children,
}: {
  header?: ReactNode;
  footer?: ReactNode;
  centerMain?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-background">
      {header}
      <main
        className={cn(
          'min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-5',
          centerMain ? 'flex flex-col items-center justify-center py-8' : 'py-5',
        )}
      >
        <div className={cn('w-full', centerMain && 'flex flex-col items-center')}>
          {children}
        </div>
      </main>
      {footer ? (
        <footer className="shrink-0 border-t border-border/80 bg-card px-5 py-4">
          {footer}
        </footer>
      ) : null}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex w-full max-w-[300px] flex-col items-center text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/12 ring-1 ring-primary/20">
        <Wrench className="size-9 text-primary" strokeWidth={1.75} />
      </div>

      <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">
        No modifications yet
      </h2>

      <p className="mt-3 max-w-[260px] text-sm leading-6 text-muted-foreground">
        Add a request header or overwrite a cookie value to get started.
      </p>

      <Button
        type="button"
        size="lg"
        className="mt-10 h-11 w-full max-w-[240px] rounded-lg px-6 shadow-sm"
        data-flow-target="add-empty"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        Add modification
      </Button>
    </div>
  );
}

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-[280px] text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function AppHeader({ title }: { title: string }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-center border-b border-primary/25 bg-primary px-5">
      <span className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </span>
    </header>
  );
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="relative flex h-14 shrink-0 items-center justify-center border-b border-border bg-card px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute left-3 size-9"
        onClick={onBack}
      >
        <ArrowLeft className="size-4" />
      </Button>
      <span className="px-10 text-center text-sm font-semibold tracking-tight text-foreground">
        {title}
      </span>
    </header>
  );
}

function TypeOption({
  icon: Icon,
  title,
  description,
  flowTarget,
  onClick,
}: {
  icon: typeof Globe;
  title: string;
  description: string;
  flowTarget?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      data-flow-target={flowTarget}
      className="flex w-full items-center gap-4 rounded-2xl border border-border/80 bg-card p-5 text-left shadow-sm transition-all hover:border-primary/35 hover:bg-accent/40 active:scale-[0.995]"
      onClick={onClick}
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-1.5 text-xs leading-5 text-muted-foreground">{description}</div>
      </div>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground/80" />
    </button>
  );
}

function ModificationSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="border-b border-border/80 bg-muted/20 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </div>
      <div className="divide-y divide-border/80">{children}</div>
    </section>
  );
}

function RuleListItem({
  enabled,
  primary,
  secondary,
  onToggle,
  onOpen,
  onDelete,
}: {
  enabled: boolean;
  primary: string;
  secondary: string;
  onToggle: (enabled: boolean) => void;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Switch checked={enabled} onCheckedChange={onToggle} />
      <button
        type="button"
        className="min-w-0 flex-1 px-1 text-left"
        onClick={onOpen}
      >
        <div className="truncate text-sm font-medium text-foreground">{primary}</div>
        <div className="mt-1 truncate text-xs text-muted-foreground">{secondary}</div>
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-9 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}

function RuleEditorFields({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2.5">
      <Label
        htmlFor={htmlFor}
        className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/80 bg-card px-4 py-3.5">
      <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-foreground">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function EditorActions({
  onDelete,
  onDone,
  doneLabel = 'Done',
}: {
  onDelete: () => void;
  onDone: () => void;
  doneLabel?: string;
}) {
  return (
    <div className="flex gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-11 flex-1 rounded-lg"
        onClick={onDelete}
      >
        Delete
      </Button>
      <Button
        type="button"
        size="lg"
        className="h-11 flex-1 rounded-lg shadow-sm"
        data-flow-target="editor-done"
        onClick={onDone}
      >
        {doneLabel}
      </Button>
    </div>
  );
}
