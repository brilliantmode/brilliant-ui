import { registry } from "@brilliant-ui/registry";
import {
  type MouseEvent,
  type ReactNode,
  StrictMode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import {
  FileUpload,
  FileUploadDescription,
  FileUploadDropzone,
  FileUploadError,
  FileUploadIcon,
  FileUploadList,
  FileUploadTitle,
} from "./components/ui/file-upload";
import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterContainer,
  FooterDescription,
  FooterGroup,
  FooterLink,
  FooterMain,
  FooterNav,
} from "./components/ui/footer";
import {
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderContainer,
  HeaderLink,
  HeaderNav,
} from "./components/ui/header";
import { PhotoUpload } from "./components/ui/photo-upload";
import "./styles.css";

type NavItem = readonly [label: string, href: string];
type NavGroup = {
  label: string;
  items: readonly NavItem[];
};

const navGroups = [
  {
    items: [
      ["Getting Started", "/"],
      ["Why Brilliant", "/#why-brilliant"],
      ["shadcn", "/#shadcn"],
      ["Components", "/components"],
    ],
    label: "Start",
  },
  {
    items: [
      ["Button", "/components/button"],
      ["Button Group", "/components/button-group"],
      ["Badge", "/components/badge"],
      ["Card", "/components/card"],
      ["Text", "/components/text"],
      ["Avatar", "/components/avatar"],
      ["Aspect Ratio", "/components/aspect-ratio"],
      ["Photo", "/components/photo"],
      ["Separator", "/components/separator"],
    ],
    label: "Display",
  },
  {
    items: [
      ["Input", "/components/input"],
      ["File Upload", "/components/file-upload"],
      ["Photo Upload", "/components/photo-upload"],
      ["Label", "/components/label"],
      ["Textarea", "/components/textarea"],
      ["Field", "/components/field"],
      ["Checkbox", "/components/checkbox"],
      ["Switch", "/components/switch"],
      ["Radio Group", "/components/radio-group"],
      ["Slider", "/components/slider"],
      ["Select", "/components/select"],
      ["Combobox", "/components/combobox"],
      ["Calendar", "/components/calendar"],
      ["Date Input", "/components/date-input"],
      ["Form", "/components/form"],
    ],
    label: "Forms",
  },
  {
    items: [
      ["Dialog", "/components/dialog"],
      ["Alert Dialog", "/components/alert-dialog"],
      ["Drawer", "/components/drawer"],
      ["Sheet", "/components/sheet"],
      ["Dropdown Menu", "/components/dropdown-menu"],
      ["Tooltip", "/components/tooltip"],
      ["Popover", "/components/popover"],
      ["Hover Card", "/components/hover-card"],
      ["Context Menu", "/components/context-menu"],
      ["Command", "/components/command"],
    ],
    label: "Overlays",
  },
  {
    items: [
      ["Alert", "/components/alert"],
      ["Skeleton", "/components/skeleton"],
      ["Progress", "/components/progress"],
      ["Spinner", "/components/spinner"],
      ["Empty State", "/components/empty-state"],
      ["Toast", "/components/toast"],
    ],
    label: "Feedback",
  },
  {
    items: [
      ["Tabs", "/components/tabs"],
      ["Accordion", "/components/accordion"],
      ["Collapsible", "/components/collapsible"],
      ["Carousel", "/components/carousel"],
      ["Table", "/components/table"],
      ["Scroll Area", "/components/scroll-area"],
      ["Breadcrumb", "/components/breadcrumb"],
      ["Navigation Menu", "/components/navigation-menu"],
      ["Menubar", "/components/menubar"],
      ["Pagination", "/components/pagination"],
    ],
    label: "Navigation & data",
  },
  {
    items: [
      ["Header", "/components/header"],
      ["Footer", "/components/footer"],
      ["Application Shell", "/components/application-shell"],
      ["Onboarding Wizard", "/components/onboarding-wizard"],
      ["Foundations", "/foundations"],
      ["Blocks", "/blocks"],
      ["Theming", "/theming"],
      ["CLI", "/cli"],
    ],
    label: "System",
  },
] as const satisfies readonly NavGroup[];

const topNavItems = [
  ["Docs", "/"],
  ["Components", "/components"],
  ["Foundations", "/foundations"],
  ["Blocks", "/blocks"],
  ["Theming", "/theming"],
  ["CLI", "/cli"],
] as const satisfies readonly NavItem[];

type NavHref = string;
type NavigateHandler = (event: MouseEvent<HTMLAnchorElement>, href: string) => void;
type RouteSelectHandler = (href: string) => void;

const docsSearchItems = navGroups.flatMap((group) =>
  group.items.map(([label, href]) => ({ group: group.label, href, label })),
);

function normalizePathname(pathname: string) {
  const withoutTrailingSlash = pathname.replace(/\/+$/, "");
  return withoutTrailingSlash === "" ? "/" : withoutTrailingSlash;
}

function getRoute() {
  return `${normalizePathname(window.location.pathname)}${window.location.hash}`;
}

function routePathname(route: string) {
  return normalizePathname(route.split("#")[0] || "/");
}

function routeHash(route: string) {
  return route.includes("#") ? `#${route.split("#").slice(1).join("#")}` : "";
}

function isRouteActive(route: string, href: string) {
  const pathname = routePathname(route);
  const targetPathname = routePathname(href);

  if (targetPathname === "/") {
    return pathname === "/" && (href === "/" || routeHash(route) === routeHash(href));
  }

  return pathname === targetPathname;
}

const buttonVariants = [
  [
    "Default",
    "Save changes",
    "bg-primary text-primary-foreground hover:-translate-y-px hover:bg-primary/92 active:translate-y-0 active:scale-[0.99] active:bg-primary/88",
  ],
  [
    "Secondary",
    "Secondary",
    "border border-border bg-surface text-foreground shadow-sm hover:-translate-y-px hover:border-foreground/40 hover:bg-muted hover:shadow-md active:translate-y-0 active:scale-[0.99] active:bg-secondary active:shadow-sm",
  ],
  [
    "Outline",
    "Outline",
    "border border-border bg-background text-foreground hover:border-foreground/50 hover:bg-muted active:scale-[0.99] active:bg-secondary",
  ],
  [
    "Ghost",
    "Ghost",
    "border border-transparent text-foreground hover:bg-muted active:scale-[0.99] active:bg-secondary",
  ],
  [
    "Critical",
    "Delete",
    "border border-critical bg-critical text-critical-foreground shadow-sm hover:-translate-y-px hover:bg-critical/92 hover:shadow-md active:translate-y-0 active:scale-[0.99] active:bg-critical/88 active:shadow-sm",
  ],
] as const;

const buttonSizes = [
  ["Small", "h-8 px-3 text-xs"],
  ["Default", "h-9 px-3.5 text-sm"],
  ["Large", "h-10 px-[1.125rem] text-sm"],
  ["Icon", "size-9 px-0 text-sm"],
] as const;

const buttonProps = [
  ["variant", '"primary" | "secondary" | "outline" | "ghost" | "critical"', '"primary"'],
  ["size", '"sm" | "md" | "lg" | "icon"', '"md"'],
  ["type", 'ButtonHTMLAttributes<HTMLButtonElement>["type"]', '"button"'],
  ["className", "string", "undefined"],
] as const;

const foundations = [
  ["Tokens", "Brandable OKLCH color, radius, elevation, typography, density, and motion tokens."],
  ["Themes", "Light, dark, system preference, high-contrast, and brand override contracts."],
  ["Micro UX", "Reusable press, lift, reveal, focus, loading, and reduced-motion primitives."],
  ["Registry", "Versioned shadcn-compatible items with metadata, checksums, and safe paths."],
  ["CLI", "Project init, shadcn alias mapping, dry runs, forced updates, and manifests."],
] as const;

const differentiators = [
  [
    "shadcn-compatible source",
    "Install editable source into your app, keep the familiar aliases, and own the generated files.",
  ],
  [
    "Micro UX built in",
    "Press, lift, reveal, loading, and reduced-motion behavior ship inside component recipes.",
  ],
  [
    "Enterprise defaults",
    "Crisp system typography, restrained motion, keyboard focus, high contrast, and dense layouts.",
  ],
  [
    "Product blocks",
    "SaaS, enterprise, data, and AI screens sit above primitives so teams start closer to real apps.",
  ],
] as const;

const shadcnFlow = [
  ["Initialize", "npx brilliant-ui init"],
  ["Add components", "npx brilliant-ui add button dialog dropdown-menu"],
  ["Own the source", "Edit components/ui/* exactly like a shadcn project"],
] as const;

const blockGroups = [
  ["Application", "App shell, dashboard, settings, authentication, master detail"],
  ["Data", "Tables, audit explorer, usage meters, invoices, charts"],
  ["Forms", "Fields, upload, OTP, wizard, filters, schema renderer"],
  ["AI", "Prompt input, chat thread, tool calls, citations, agent status"],
  ["SaaS", "Billing, API keys, webhooks, members, feature flags"],
  ["Enterprise", "Permissions, roles, policies, org tree, access timeline"],
] as const;

const productBlockExamples = [
  {
    category: "Activation",
    code: `import { useState } from "react";
import {
  OnboardingWizard,
  OnboardingWizardActions,
  OnboardingWizardContent,
  OnboardingWizardMeta,
  OnboardingWizardPanel,
  OnboardingWizardProgress,
  OnboardingWizardStep,
  OnboardingWizardStepList,
} from "@/components/ui/onboarding-wizard";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Workspace",
    description: "Name and team defaults",
    heading: "Create workspace",
    body: "Confirm the workspace name, region, and default team settings.",
  },
  {
    title: "Import data",
    description: "Bring in existing customers",
    heading: "Import customer records",
    body: "Connect Salesforce or upload a CSV. Nothing is written until fields are mapped.",
  },
  {
    title: "Invite team",
    description: "Add operators and reviewers",
    heading: "Invite team members",
    body: "Send invites now or copy a secure invite link for later.",
  },
] as const;

const importMethods = [
  ["Connect Salesforce", "Sync accounts and owners."],
  ["Upload CSV", "Review columns before import."],
] as const;

export function WorkspaceImportBlock() {
  const [activeStep, setActiveStep] = useState(1);
  const [method, setMethod] = useState<(typeof importMethods)[number][0]>("Connect Salesforce");
  const currentStep = steps[activeStep];
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <OnboardingWizard variant="split">
      <div>
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Launch workspace</h2>
          <p className="text-sm text-muted-foreground">Complete the setup checklist.</p>
          <OnboardingWizardProgress value={progress} />
        </div>
        <OnboardingWizardStepList>
          {steps.map((step, index) => (
            <OnboardingWizardStep
              description={step.description}
              index={index + 1}
              key={step.title}
              onClick={() => setActiveStep(index)}
              state={index < activeStep ? "complete" : index === activeStep ? "current" : "upcoming"}
              title={step.title}
            />
          ))}
        </OnboardingWizardStepList>
      </div>

      <OnboardingWizardPanel>
        <OnboardingWizardContent>
          <OnboardingWizardMeta>Recommended next step</OnboardingWizardMeta>
          <div>
            <h3 className="text-lg font-semibold">{currentStep.heading}</h3>
            <p className="text-sm text-muted-foreground">
              {currentStep.body}
            </p>
          </div>
          {activeStep === 1 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {importMethods.map(([title, description]) => (
                <button
                  aria-pressed={method === title}
                  className="rounded-lg border border-border p-4 text-left data-[selected=true]:border-primary data-[selected=true]:bg-primary/5"
                  data-selected={method === title}
                  key={title}
                  onClick={() => setMethod(title)}
                  type="button"
                >
                  <span className="block font-medium">{title}</span>
                  <span className="text-sm text-muted-foreground">{description}</span>
                </button>
              ))}
            </div>
          ) : null}
        </OnboardingWizardContent>
        <OnboardingWizardActions>
          <Button
            disabled={activeStep === 0}
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            variant="ghost"
          >
            Back
          </Button>
          <Button onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}>
            {activeStep === steps.length - 1 ? "Finish" : "Continue"}
          </Button>
        </OnboardingWizardActions>
      </OnboardingWizardPanel>
    </OnboardingWizard>
  );
}`,
    description: "A first-run setup block with progress, step rail, import choices, and actions.",
    id: "workspace-import",
    title: "Workspace import flow",
  },
  {
    category: "SaaS",
    code: `import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const keys = [
  ["Production", "Last used 2 minutes ago", "Live"],
  ["Staging", "Last used yesterday", "Scoped"],
];

export function ApiKeysBlock() {
  return (
    <Card className="p-5" variant="surface">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold">API keys</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage keys used by integrations and automations.
          </p>
        </div>
        <Button size="sm">Create key</Button>
      </div>
      <div className="mt-5 divide-y divide-border rounded-lg border border-border">
        {keys.map(([name, detail, state]) => (
          <div className="flex items-center justify-between gap-3 p-3" key={name}>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
            <Badge variant={state === "Live" ? "primary" : "muted"}>{state}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}`,
    description:
      "A production admin block for API keys with status, dense rows, and action hierarchy.",
    id: "api-keys",
    title: "API key management",
  },
  {
    category: "Billing",
    code: `import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function BillingUsageBlock() {
  return (
    <Card className="p-5" variant="elevated">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Current billing period</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">2.4M events</h3>
        </div>
        <Button size="sm" variant="outline">Manage plan</Button>
      </div>
      <div className="mt-5 grid gap-2">
        <div className="flex items-center justify-between text-sm">
          <span>Usage included</span>
          <span className="font-medium">64%</span>
        </div>
        <Progress aria-label="Usage included" value={64} />
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Seats</dt>
          <dd className="text-sm font-medium">48 active</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Renewal</dt>
          <dd className="text-sm font-medium">Aug 30</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Forecast</dt>
          <dd className="text-sm font-medium">12% below</dd>
        </div>
      </dl>
    </Card>
  );
}`,
    description:
      "A billing block with usage meter, renewal metadata, forecast status, and plan action.",
    id: "billing-usage",
    title: "Billing usage summary",
  },
] as const;

const usageByComponent = {
  button: `import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Button size="md" variant="primary">
      Save changes
    </Button>
  );
}`,
  "button-group": `import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function Example() {
  return (
    <ButtonGroup aria-label="View density">
      <Button variant="secondary">Compact</Button>
      <Button variant="primary">Comfortable</Button>
      <Button variant="outline">Touch</Button>
    </ButtonGroup>
  );
}`,
  badge: `import { Badge } from "@/components/ui/badge";

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Live</Badge>
      <Badge variant="muted">Enterprise</Badge>
    </div>
  );
}`,
  "aspect-ratio": `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Example() {
  return (
    <AspectRatio ratio={16 / 9}>
      <div className="grid size-full place-items-center bg-primary text-primary-foreground">
        <span className="rounded-md bg-background/15 px-2 py-1 text-xs font-medium">
          16:9 preview
        </span>
      </div>
    </AspectRatio>
  );
}`,
  photo: `import {
  Photo,
  PhotoCaption,
  PhotoFallback,
  PhotoImage,
  PhotoTint,
} from "@/components/ui/photo";

export function Example() {
  return (
    <Photo ratio={16 / 10} radius="md" variant="surface">
      <PhotoFallback>Workspace preview unavailable</PhotoFallback>
      <PhotoImage
        alt="Sunlit concrete atrium"
        filter="soft"
        src="/images/photo-architecture.jpg"
      />
      <PhotoTint color="var(--brilliant-primary)" opacity={0.12} />
      <PhotoCaption>Sunlit concrete atrium</PhotoCaption>
    </Photo>
  );
}`,
  avatar: `import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarStatus,
} from "@/components/ui/avatar";

export function Example() {
  return (
    <div className="flex items-end gap-4">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarImage
            alt="Alex Rivera"
            src="/images/avatar-product-designer.jpg"
          />
          <AvatarFallback>AR</AvatarFallback>
          <AvatarStatus size={size} status="online" />
        </Avatar>
      ))}
    </div>
  );
}`,
  card: `import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export function Example() {
  const [isProcessing] = useState(true);

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Card interactive variant="surface">
        <CardHeader>
          <CardTitle>Surface</CardTitle>
          <CardDescription>Neutral group</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive variant="elevated">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
          <CardDescription>Dashboard metric</CardDescription>
        </CardHeader>
      </Card>
      <Card interactive variant="accent">
        <CardHeader>
          <CardTitle>Accent</CardTitle>
          <CardDescription>Selected state</CardDescription>
        </CardHeader>
      </Card>
      <Card beam={isProcessing} interactive variant="beam">
        <CardHeader>
          <CardTitle>Beam</CardTitle>
          <CardDescription>Live premium state</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}`,
  text: `import { Text } from "@/components/ui/text";

export function Example() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Text size="lg" variant="default">Revenue intelligence</Text>
      <Text size="lg" variant="muted">Updated 2 minutes ago</Text>
      <Text size="lg" variant="glow">AI ready</Text>
      <Text shimmerColor="white" size="lg" variant="shimmer">
        Generating workspace insights
      </Text>
    </div>
  );
}`,
  input: `import { Input } from "@/components/ui/input";

export function Example() {
  return <Input name="brilliant-input-preview" placeholder="Acme workspace" />;
}`,
  "file-upload": `import {
  FileUpload,
  FileUploadDescription,
  FileUploadDropzone,
  FileUploadError,
  FileUploadIcon,
  FileUploadList,
  FileUploadTitle,
} from "@/components/ui/file-upload";

export function Example() {
  return (
    <FileUpload
      accept=".csv,text/csv"
      maxFiles={3}
      maxSize={5 * 1024 * 1024}
      multiple
    >
      <FileUploadDropzone>
        <span>
          <FileUploadIcon />
          <FileUploadTitle>Drop CSV files here or click to browse</FileUploadTitle>
          <FileUploadDescription>Up to 3 files, 5 MB each.</FileUploadDescription>
        </span>
      </FileUploadDropzone>
      <FileUploadList />
      <FileUploadError />
    </FileUpload>
  );
}`,
  "photo-upload": `import { PhotoUpload } from "@/components/ui/photo-upload";
import { useState } from "react";

export function Example() {
  const [photo, setPhoto] = useState<File | null>(null);

  return (
    <PhotoUpload
      alt="Workspace profile"
      className="mx-auto max-w-lg"
      crop="square"
      file={photo}
      maxSize={5 * 1024 * 1024}
      onFileChange={setPhoto}
    />
  );
}`,
  label: `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Example() {
  return (
    <div className="space-y-2">
      <Label htmlFor="workspace">Workspace name</Label>
      <Input defaultValue="Acme" id="workspace" />
    </div>
  );
}`,
  textarea: `import { Textarea } from "@/components/ui/textarea";

export function Example() {
  return <Textarea placeholder="Add a launch note..." />;
}`,
  field: `import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Example() {
  return (
    <Field>
      <FieldLabel htmlFor="workspace-email">Workspace email</FieldLabel>
      <Input id="workspace-email" defaultValue="workspace@company.com" type="email" />
      <FieldDescription>Used for billing and approvals.</FieldDescription>
    </Field>
  );
}`,
  checkbox: `import { Checkbox } from "@/components/ui/checkbox";

export function Example() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="flex items-center gap-4">
        <Checkbox defaultChecked size="lg" />
        <span>
          <span className="block font-medium">Checked</span>
          <span className="block text-xs text-muted-foreground">Require approval</span>
        </span>
      </label>
      <label className="flex items-center gap-4">
        <Checkbox size="lg" />
        <span>
          <span className="block font-medium">Empty</span>
          <span className="block text-xs text-muted-foreground">Optional export</span>
        </span>
      </label>
      <label className="flex items-center gap-4">
        <Checkbox checked="indeterminate" size="lg" />
        <span>
          <span className="block font-medium">Mixed</span>
          <span className="block text-xs text-muted-foreground">3 of 8 selected</span>
        </span>
      </label>
    </div>
  );
}`,
  switch: `import { Switch } from "@/components/ui/switch";

export function Example() {
  return (
    <label className="flex items-center gap-3">
      <Switch aria-label="Enable sync" defaultChecked />
      <span>Enabled</span>
    </label>
  );
}`,
  slider: `import { Slider } from "@/components/ui/slider";

export function Example() {
  return (
    <Slider
      aria-label="Usage threshold"
      defaultValue={64}
      max={100}
      min={0}
    />
  );
}`,
  select: `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Example() {
  return (
    <Select defaultValue="owner">
      <SelectTrigger aria-label="Workspace role">
        <SelectValue placeholder="Choose role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="owner">Owner</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
        <SelectItem value="member">Member</SelectItem>
      </SelectContent>
    </Select>
  );
}`,
  combobox: `import { Combobox } from "@/components/ui/combobox";

export function Example() {
  return (
    <Combobox
      aria-label="Search workspace"
      options={[
        { label: "Acme", value: "Acme" },
        { label: "Brilliant", value: "Brilliant" },
        { label: "Unifabriq", value: "Unifabriq" },
      ]}
      placeholder="Search workspace"
    />
  );
}`,
  "radio-group": `import { RadioGroup, RadioItem } from "@/components/ui/radio-group";

export function Example() {
  return (
    <RadioGroup aria-label="Billing plan" defaultValue="pro" size="md">
      <RadioItem
        description="Usage, members, and API controls"
        label="Pro"
        value="pro"
      />
      <RadioItem
        description="SAML, SCIM, audit logs"
        label="Enterprise"
        value="enterprise"
      />
    </RadioGroup>
  );
}`,
  alert: `import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function Example() {
  return (
    <Alert variant="primary">
      <AlertTitle>Sync complete</AlertTitle>
      <AlertDescription>All records are current.</AlertDescription>
    </Alert>
  );
}`,
  dialog: `import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function Example() {
  return (
    <Dialog open>
      <DialogHeader>
        <DialogTitle>Invite teammate</DialogTitle>
      </DialogHeader>
      <DialogContent>{/* Form fields */}</DialogContent>
      <DialogFooter>{/* Actions */}</DialogFooter>
    </Dialog>
  );
}`,
  "alert-dialog": `import { useRef } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function Example() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button variant="critical" onClick={() => dialogRef.current?.showModal()}>
        Delete API key
      </Button>
      <AlertDialog ref={dialogRef}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete API key?</AlertDialogTitle>
          <AlertDialogDescription>
            This immediately revokes access for connected services.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogContent>{/* consequences or object summary */}</AlertDialogContent>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => dialogRef.current?.close()}>
            Cancel
          </Button>
          <Button variant="critical">Delete</Button>
        </AlertDialogFooter>
      </AlertDialog>
    </>
  );
}`,
  drawer: `import { useRef } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function Example() {
  const drawerRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => drawerRef.current?.showModal()}>
        Open mobile filters
      </button>
      <Drawer ref={drawerRef}>
        <DrawerHeader>
          <DrawerTitle>Usage filters</DrawerTitle>
          <DrawerDescription>Filter events without leaving the report.</DrawerDescription>
        </DrawerHeader>
        <DrawerContent>{/* filter controls */}</DrawerContent>
      </Drawer>
    </>
  );
}`,
  sheet: `import { useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function Example() {
  const sheetRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button type="button" onClick={() => sheetRef.current?.showModal()}>
        Edit workspace
      </button>

      <Sheet ref={sheetRef} side="right">
        <SheetHeader>
          <SheetTitle>Workspace settings</SheetTitle>
          <SheetDescription>
            Edit billing and access defaults without leaving the page.
          </SheetDescription>
        </SheetHeader>
        <SheetContent>{/* form fields */}</SheetContent>
        <button type="button" onClick={() => sheetRef.current?.close()}>
          Close
        </button>
      </Sheet>
    </>
  );
}`,
  tooltip: `import { Tooltip } from "@/components/ui/tooltip";

export function Example() {
  return (
    <Tooltip content="Copied on click">
      <button type="button">API key</button>
    </Tooltip>
  );
}`,
  popover: `import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Example() {
  return (
    <Popover>
      <PopoverTrigger>Open filters</PopoverTrigger>
      <PopoverContent>Status, owner, and date controls.</PopoverContent>
    </Popover>
  );
}`,
  "hover-card": `import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger>Nirvana R</HoverCardTrigger>
      <HoverCardContent>Workspace owner · active now.</HoverCardContent>
    </HoverCard>
  );
}`,
  "context-menu": `import { ContextMenu } from "@/components/ui/context-menu";

export function Example() {
  return (
    <ContextMenu>
      <div className="rounded-md border border-border p-4">
        Right-click this workspace row
      </div>
    </ContextMenu>
  );
}`,
  "dropdown-menu": `import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Example() {
  const [compact, setCompact] = useState(true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Workspace actions</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>Open audit log</DropdownMenuItem>
        <DropdownMenuItem>Invite teammate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={compact} onCheckedChange={setCompact}>
          Compact density
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
  tabs: `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function Example() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Workspace overview</TabsContent>
      <TabsContent value="usage">Usage is trending below forecast.</TabsContent>
      <TabsContent value="billing">Renewal closes August 30.</TabsContent>
    </Tabs>
  );
}`,
  accordion: `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Example() {
  return (
    <Accordion>
      <AccordionItem open>
        <AccordionTrigger>What ships with Brilliant?</AccordionTrigger>
        <AccordionContent>Tokens, micro UX, and source components.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
  collapsible: `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleItem,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Example() {
  return (
    <Collapsible>
      <CollapsibleItem open>
        <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
        <CollapsibleContent>Optional controls stay available on demand.</CollapsibleContent>
      </CollapsibleItem>
    </Collapsible>
  );
}`,
  carousel: `import {
  Carousel,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselTrack,
  CarouselViewport,
} from "@/components/ui/carousel";

const slides = ["Usage", "Billing", "Members"];

export function Example() {
  return (
    <Carousel itemCount={slides.length}>
      <CarouselViewport>
        <CarouselTrack>
          {slides.map((slide) => (
            <CarouselItem key={slide}>{slide}</CarouselItem>
          ))}
        </CarouselTrack>
      </CarouselViewport>
      <div className="flex items-center justify-between">
        <CarouselPrevious />
        <CarouselDots />
        <CarouselNext />
      </div>
    </Carousel>
  );
}`,
  table: `import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Workspace</TableHead>
          <TableHead>Plan</TableHead>
          <TableHead>Seats</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Acme</TableCell>
          <TableCell>Enterprise</TableCell>
          <TableCell>48</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
  form: `import {
  Form,
  FormActions,
  FormDescription,
  FormHeader,
  FormSection,
  FormTitle,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Example() {
  return (
    <Form>
      <FormSection>
        <FormHeader>
          <FormTitle>Workspace settings</FormTitle>
          <FormDescription>Defaults used for invites and billing.</FormDescription>
        </FormHeader>
        <Field>
          <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>
          <Input id="workspace-name" defaultValue="Acme" />
          <FieldDescription>Visible to everyone in the organization.</FieldDescription>
        </Field>
        <FormActions>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </FormActions>
      </FormSection>
    </Form>
  );
}`,
  "scroll-area": `import { ScrollArea } from "@/components/ui/scroll-area";

export function Example() {
  return (
    <ScrollArea className="h-48 rounded-md border border-border">
      <div className="grid gap-2 p-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index}>Audit event {index + 1}</div>
        ))}
      </div>
    </ScrollArea>
  );
}`,
  breadcrumb: `import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function Example() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>Workspace</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>Settings</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>API keys</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}`,
  "navigation-menu": `import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
      <NavigationMenuLink href="/usage">Usage</NavigationMenuLink>
      <NavigationMenuLink href="/settings">Settings</NavigationMenuLink>
    </NavigationMenu>
  );
}`,
  menubar: `import { Menubar, MenubarItem } from "@/components/ui/menubar";

export function Example() {
  return (
    <Menubar>
      <MenubarItem>File</MenubarItem>
      <MenubarItem>Edit</MenubarItem>
      <MenubarItem>View</MenubarItem>
    </Menubar>
  );
}`,
  pagination: `import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@/components/ui/pagination";

export function Example() {
  return (
    <Pagination>
      <PaginationList>
        <PaginationItem><PaginationLink href="?page=1">1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink aria-current="page" href="?page=2">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="?page=3">3</PaginationLink></PaginationItem>
      </PaginationList>
    </Pagination>
  );
}`,
  separator: `import { Separator } from "@/components/ui/separator";

export function Example() {
  return <Separator variant="primary" />;
}`,
  skeleton: `import { Skeleton } from "@/components/ui/skeleton";

export function Example() {
  return <Skeleton size="title" variant="raised" />;
}`,
  progress: `import { Progress } from "@/components/ui/progress";

export function Example() {
  return <Progress aria-label="Sync progress" value={64} />;
}`,
  spinner: `import { Spinner } from "@/components/ui/spinner";

export function Example() {
  return <Spinner label="Saving settings" size="md" variant="default" />;
}`,
  toast: `import { ToastProvider, useToast } from "@/components/ui/toast";

function SaveButton() {
  const { toast } = useToast();

  return (
    <button
      type="button"
      onClick={() =>
        toast({
          title: "Settings saved",
          description: "Workspace policy updated.",
          variant: "primary",
        })
      }
    >
      Save settings
    </button>
  );
}

export function Example() {
  return (
    <ToastProvider>
      <SaveButton />
    </ToastProvider>
  );
}`,
  "date-input": `import { DateInput } from "@/components/ui/date-input";

export function Example() {
  return <DateInput aria-label="Renewal date" defaultValue="2026-08-19" />;
}`,
  calendar: `import { Calendar } from "@/components/ui/calendar";

export function Example() {
  return (
    <Calendar>
      <tbody>{/* Calendar rows */}</tbody>
    </Calendar>
  );
}`,
  command: `import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function Example() {
  return (
    <Command>
      <CommandInput placeholder="Search commands..." />
      <CommandList>
        <CommandItem>Invite teammate</CommandItem>
      </CommandList>
    </Command>
  );
}`,
  header: `import {
  Header,
  HeaderActions,
  HeaderBrand,
  HeaderContainer,
  HeaderLink,
  HeaderMobileTrigger,
  HeaderNav,
} from "@/components/ui/header";
import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Header
      behavior="elevate"
      position="sticky"
      scrollThreshold={24}
    >
      <HeaderContainer>
        <HeaderBrand href="/">Brilliant</HeaderBrand>
        <HeaderMobileTrigger />
        <HeaderNav>
          <HeaderLink active href="/dashboard">Dashboard</HeaderLink>
          <HeaderLink href="/projects">Projects</HeaderLink>
          <HeaderLink href="/settings">Settings</HeaderLink>
        </HeaderNav>
        <HeaderActions className="hidden md:flex">
          <Button size="sm">New project</Button>
        </HeaderActions>
      </HeaderContainer>
    </Header>
  );
}`,
  footer: `import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterContainer,
  FooterDescription,
  FooterGroup,
  FooterLink,
  FooterMain,
  FooterNav,
} from "@/components/ui/footer";

export function Example() {
  return (
    <Footer variant="surface">
      <FooterContainer>
        <FooterMain>
          <div>
            <FooterBrand href="/">Brilliant UI</FooterBrand>
            <FooterDescription>
              App-owned components with enterprise defaults and built-in micro UX.
            </FooterDescription>
          </div>
          <FooterNav>
            <FooterGroup title="Product">
              <FooterLink href="/components">Components</FooterLink>
              <FooterLink href="/blocks">Blocks</FooterLink>
            </FooterGroup>
            <FooterGroup title="Resources">
              <FooterLink href="/docs">Documentation</FooterLink>
              <FooterLink href="/changelog">Changelog</FooterLink>
            </FooterGroup>
            <FooterGroup title="Company">
              <FooterLink href="/about">About</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterGroup>
          </FooterNav>
        </FooterMain>
        <FooterBottom>
          <span>© 2026 Brilliant UI</span>
          <div className="flex gap-4">
            <FooterLink href="/privacy">Privacy</FooterLink>
            <FooterLink href="/terms">Terms</FooterLink>
          </div>
        </FooterBottom>
      </FooterContainer>
    </Footer>
  );
}`,
  "application-shell": `import {
  ApplicationShell,
  ApplicationShellAccountItem,
  ApplicationShellAccountSwitcher,
  ApplicationShellBrand,
  ApplicationShellHeader,
  ApplicationShellMain,
  ApplicationShellMenu,
  ApplicationShellMenuItem,
  ApplicationShellMenuSection,
  ApplicationShellMobileTrigger,
  ApplicationShellNav,
  ApplicationShellNavGroupItem,
  ApplicationShellNavItem,
  ApplicationShellNavMedia,
  ApplicationShellNavSection,
  ApplicationShellSearch,
  ApplicationShellSidebar,
} from "@/components/ui/application-shell";

export function Example() {
  return (
    <ApplicationShell>
      <ApplicationShellSidebar>
        <ApplicationShellBrand href="/">
          <ApplicationShellNavMedia>B</ApplicationShellNavMedia>
          <span>
            <span className="block text-sm font-semibold">Brilliant</span>
            <span className="block text-xs text-muted-foreground">Component system</span>
          </span>
        </ApplicationShellBrand>
        <ApplicationShellSearch href="/search">
          <span aria-hidden="true">⌕</span>
          <span className="flex-1">Search docs</span>
          <kbd>/</kbd>
        </ApplicationShellSearch>

        <ApplicationShellNav>
          <ApplicationShellNavSection title="Main">
            <ApplicationShellNavItem
              className="font-medium text-foreground"
              href="/contracts"
              icon="□"
            >
              Contracts
            </ApplicationShellNavItem>
            <ApplicationShellNavItem href="/analysts" icon="□">
              Analysts
            </ApplicationShellNavItem>
            <ApplicationShellNavItem href="/settings" icon="□">
              Setting
            </ApplicationShellNavItem>
          </ApplicationShellNavSection>

          <ApplicationShellNavSection title="Inboxes">
            <ApplicationShellNavGroupItem
              description="(209) 555-0104"
              href="/clients"
              media={<ApplicationShellNavMedia tone="primary">C</ApplicationShellNavMedia>}
            >
              Clients
            </ApplicationShellNavGroupItem>
            <ApplicationShellNavGroupItem
              description="(239) 555-0108"
              href="/personal"
              media={<ApplicationShellNavMedia tone="warning">P</ApplicationShellNavMedia>}
            >
              Personal
            </ApplicationShellNavGroupItem>
          </ApplicationShellNavSection>
        </ApplicationShellNav>

        <ApplicationShellMenu>
          <ApplicationShellMenuItem icon="☾">Set yourself as away</ApplicationShellMenuItem>
          <ApplicationShellMenuItem active icon="○" trailing="⌁">
            Pause notifications
          </ApplicationShellMenuItem>
          <ApplicationShellMenuItem icon="○">Help</ApplicationShellMenuItem>
          <ApplicationShellMenuItem icon="○">Profile Settings</ApplicationShellMenuItem>

          <ApplicationShellMenuSection title="Accounts">
            <ApplicationShellMenuItem
              media={<ApplicationShellNavMedia className="size-6 text-xs">D</ApplicationShellNavMedia>}
              trailing="✓"
            >
              Dianne Russell
            </ApplicationShellMenuItem>
            <ApplicationShellMenuItem
              media={<ApplicationShellNavMedia className="size-6 text-xs">A</ApplicationShellNavMedia>}
            >
              AG Studio
            </ApplicationShellMenuItem>
          </ApplicationShellMenuSection>
        </ApplicationShellMenu>

        <ApplicationShellAccountSwitcher>
          <ApplicationShellAccountItem
            description="russel@hey.com"
            media={<ApplicationShellNavMedia>DR</ApplicationShellNavMedia>}
            trailing="⌄"
          >
            Dianne Russell
          </ApplicationShellAccountItem>
        </ApplicationShellAccountSwitcher>
      </ApplicationShellSidebar>

      <div className="min-w-0">
        <ApplicationShellHeader>
          <ApplicationShellMobileTrigger />
          <div>
            <h1 className="text-sm font-semibold">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Live workspace overview</p>
          </div>
          <button className="ml-auto rounded bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            New report
          </button>
        </ApplicationShellHeader>
        <ApplicationShellMain>
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {["Usage", "Members", "Revenue"].map((item) => (
                <div className="rounded-lg border border-border bg-surface p-4" key={item}>
                  <div className="text-sm font-medium">{item}</div>
                  <div className="mt-1 text-2xl font-semibold tracking-tight">24K</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="h-3 w-1/3 rounded bg-muted" />
              <div className="mt-3 h-3 w-2/3 rounded bg-muted" />
            </div>
          </div>
        </ApplicationShellMain>
      </div>
    </ApplicationShell>
  );
}`,
  "onboarding-wizard": `import { useState } from "react";
import {
  OnboardingWizard,
  OnboardingWizardActions,
  OnboardingWizardContent,
  OnboardingWizardDescription,
  OnboardingWizardHeader,
  OnboardingWizardMeta,
  OnboardingWizardPanel,
  OnboardingWizardProgress,
  OnboardingWizardStep,
  OnboardingWizardStepList,
  OnboardingWizardTitle,
} from "@/components/ui/onboarding-wizard";

const steps = [
  {
    title: "Workspace",
    description: "Name and team defaults",
    heading: "Create workspace",
    body: "Confirm the workspace name, region, and default team settings.",
  },
  {
    title: "Import",
    description: "Bring in existing data",
    heading: "Import customer data",
    body: "Connect a source or upload a CSV. You can map fields before anything is written.",
  },
  {
    title: "Invite",
    description: "Add operators and reviewers",
    heading: "Invite team",
    body: "Invite operators and reviewers, or skip this until launch.",
  },
] as const;

export function Example() {
  const [activeStep, setActiveStep] = useState(1);
  const currentStep = steps[activeStep];
  const progress = Math.round(((activeStep + 1) / steps.length) * 100);

  return (
    <OnboardingWizard variant="split">
      <div>
        <OnboardingWizardHeader>
          <OnboardingWizardTitle>Launch workspace</OnboardingWizardTitle>
          <OnboardingWizardDescription>
            Configure the basics before your team starts using Brilliant.
          </OnboardingWizardDescription>
          <OnboardingWizardProgress value={progress} />
        </OnboardingWizardHeader>

        <OnboardingWizardStepList>
          {steps.map((step, index) => (
            <OnboardingWizardStep
              description={step.description}
              index={index + 1}
              key={step.title}
              onClick={() => setActiveStep(index)}
              state={index < activeStep ? "complete" : index === activeStep ? "current" : "upcoming"}
              title={step.title}
            />
          ))}
        </OnboardingWizardStepList>
      </div>

      <OnboardingWizardPanel>
        <OnboardingWizardContent>
          <OnboardingWizardMeta>Step {activeStep + 1} of {steps.length}</OnboardingWizardMeta>
          <div>
            <OnboardingWizardTitle>{currentStep.heading}</OnboardingWizardTitle>
            <OnboardingWizardDescription>
              {currentStep.body}
            </OnboardingWizardDescription>
          </div>
          {activeStep === 1 ? (
            <div className="grid gap-3 sm:grid-cols-2">
            <button className="rounded-lg border border-border bg-background p-4 text-left">
              <span className="block font-medium">Connect Salesforce</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Sync accounts and owners.
              </span>
            </button>
            <button className="rounded-lg border border-border bg-background p-4 text-left">
              <span className="block font-medium">Upload CSV</span>
              <span className="mt-1 block text-sm text-muted-foreground">
                Review columns before import.
              </span>
            </button>
          </div>
          ) : null}
        </OnboardingWizardContent>

        <OnboardingWizardActions>
          <button
            className="text-sm font-medium text-muted-foreground disabled:opacity-50"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            type="button"
          >
            Back
          </button>
          <button
            className="rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}
            type="button"
          >
            {activeStep === steps.length - 1 ? "Finish" : "Continue"}
          </button>
        </OnboardingWizardActions>
      </OnboardingWizardPanel>
    </OnboardingWizard>
  );
}`,
  "empty-state": `import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state";

export function Example() {
  return (
    <EmptyState variant="surface">
      <EmptyStateIcon>⌘</EmptyStateIcon>
      <EmptyStateTitle>No API keys</EmptyStateTitle>
      <EmptyStateDescription>
        Create a key to connect this workspace to your automation pipeline.
      </EmptyStateDescription>
      <EmptyStateActions>{/* Button or link actions */}</EmptyStateActions>
    </EmptyState>
  );
}`,
} as const;

const photoExampleCode = {
  crops: `import { Photo, PhotoImage } from "@/components/ui/photo";

export function CropExample() {
  return (
    <div className="grid items-end gap-4 sm:grid-cols-3">
      <Photo crop="rectangle" ratio={4 / 3} radius="sm">
        <PhotoImage alt="Rectangular atrium crop" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo crop="square" radius="lg">
        <PhotoImage alt="Square atrium crop" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo crop="circle">
        <PhotoImage alt="Circular atrium crop" src="/images/photo-architecture.jpg" />
      </Photo>
    </div>
  );
}`,
  filters: `import { Photo, PhotoImage, PhotoTint } from "@/components/ui/photo";

export function FilterExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Photo ratio={4 / 3}>
        <PhotoImage alt="Original atrium" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo ratio={4 / 3}>
        <PhotoImage alt="Monochrome atrium" filter="mono" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo ratio={4 / 3}>
        <PhotoImage alt="Warm atrium" filter="warm" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo ratio={4 / 3}>
        <PhotoImage alt="Indigo tinted atrium" filter="soft" src="/images/photo-architecture.jpg" />
        <PhotoTint color="var(--brilliant-primary)" opacity={0.28} />
      </Photo>
    </div>
  );
}`,
  "fit-and-fallback": `import {
  Photo,
  PhotoFallback,
  PhotoImage,
} from "@/components/ui/photo";

export function FitAndFallbackExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Photo ratio={16 / 10}>
        <PhotoImage alt="Concrete atrium detail" fit="cover" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo ratio={16 / 10}>
        <PhotoImage alt="Full concrete atrium" fit="contain" src="/images/photo-architecture.jpg" />
      </Photo>
      <Photo ratio={16 / 10}>
        <PhotoFallback>Image unavailable</PhotoFallback>
        <PhotoImage alt="Unavailable report" src="/missing-report.jpg" />
      </Photo>
    </div>
  );
}`,
  ratios: `import { Photo, PhotoCaption, PhotoImage } from "@/components/ui/photo";

export function RatioExample() {
  return (
    <div className="grid items-end gap-4 sm:grid-cols-3">
      <Photo ratio={1}>
        <PhotoImage alt="Square atrium crop" src="/images/photo-architecture.jpg" />
        <PhotoCaption>1:1 architectural crop</PhotoCaption>
      </Photo>
      <Photo ratio={3 / 4}>
        <PhotoImage alt="Portrait atrium crop" src="/images/photo-architecture.jpg" />
        <PhotoCaption>3:4 architectural crop</PhotoCaption>
      </Photo>
      <Photo ratio={16 / 9}>
        <PhotoImage alt="Wide atrium view" src="/images/photo-architecture.jpg" />
        <PhotoCaption>16:9 architectural view</PhotoCaption>
      </Photo>
    </div>
  );
}`,
  variants: `import { Photo, PhotoCaption, PhotoImage } from "@/components/ui/photo";

export function VariantExample() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {(["surface", "elevated", "ghost"] as const).map((variant) => (
        <Photo key={variant} ratio={16 / 10} variant={variant}>
          <PhotoImage alt="Sunlit concrete atrium" src="/images/photo-architecture.jpg" />
          <PhotoCaption>{variant}</PhotoCaption>
        </Photo>
      ))}
    </div>
  );
}`,
} as const;

function componentExportName(name: string) {
  return name
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function usageForComponent(name: string) {
  const explicit = usageByComponent[name as keyof typeof usageByComponent];
  if (explicit) return explicit;

  const exportName = componentExportName(name);
  return `import { ${exportName} } from "@/components/ui/${name}";

export function Example() {
  return <${exportName}>Example</${exportName}>;
}`;
}

function Badge({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "ready" }) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-md border px-2 text-xs font-medium",
        tone === "ready"
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-muted text-muted-foreground",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function SectionHeading({
  children,
  description,
  id,
}: {
  children: ReactNode;
  description: string;
  id: string;
}) {
  return (
    <div className="scroll-mt-24 border-b border-border pb-4" id={id}>
      <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function PreviewButton({ children, className }: { children: ReactNode; className: string }) {
  return (
    <button
      className={[
        "relative isolate inline-flex shrink-0 appearance-none items-center justify-center gap-2 rounded-[0.25rem] font-medium tracking-[-0.005em]",
        "motion-safe:transition-[color,background-color,border-color,box-shadow,transform,opacity] motion-safe:duration-[var(--brilliant-duration-fast)] motion-safe:ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      ].join(" ")}
      type="button"
    >
      {children}
    </button>
  );
}

const tsxKeywords = new Set([
  "as",
  "const",
  "export",
  "false",
  "from",
  "function",
  "import",
  "let",
  "return",
  "true",
  "type",
]);

type CodeLanguage = "bash" | "css" | "tsx";

function highlightInlineCode(line: string, language: CodeLanguage): ReactNode {
  if (language === "bash") {
    const shellComment = line.indexOf("#");
    if (shellComment >= 0) {
      return (
        <>
          {highlightInlineCode(line.slice(0, shellComment), "bash")}
          <span className="text-code-comment">{line.slice(shellComment)}</span>
        </>
      );
    }

    return line.split(/(\s+|--?[a-zA-Z0-9-]+|"[^"]*"|'[^']*')/g).map((part, index) => {
      if (!part) return null;
      const key = `${part}-${index}`;

      if (/^["']/.test(part)) {
        return (
          <span className="text-code-string" key={key}>
            {part}
          </span>
        );
      }

      if (/^--?/.test(part)) {
        return (
          <span className="text-code-attr" key={key}>
            {part}
          </span>
        );
      }

      if (/^(npx|pnpm|npm|yarn|bun)$/.test(part)) {
        return (
          <span className="text-code-keyword" key={key}>
            {part}
          </span>
        );
      }

      return part;
    });
  }

  if (language === "css") {
    return line
      .split(/(\/\*.*?\*\/|--[A-Za-z0-9-]+|:[^;{}]+|#[A-Fa-f0-9]+|\[[^\]]+\]|[{};])/g)
      .map((part, index) => {
        if (!part) return null;
        const key = `${part}-${index}`;

        if (part.startsWith("/*")) {
          return (
            <span className="text-code-comment" key={key}>
              {part}
            </span>
          );
        }

        if (part.startsWith("--")) {
          return (
            <span className="text-code-attr" key={key}>
              {part}
            </span>
          );
        }

        if (part.startsWith(":")) {
          return (
            <span className="text-code-string" key={key}>
              {part}
            </span>
          );
        }

        if (part.startsWith("[") || part.startsWith("#")) {
          return (
            <span className="text-code-component" key={key}>
              {part}
            </span>
          );
        }

        if (/^[{};]$/.test(part)) {
          return (
            <span className="text-code-keyword" key={key}>
              {part}
            </span>
          );
        }

        return part;
      });
  }

  return line
    .split(
      /(\/\/.*|\/\*.*?\*\/|"[^"]*"|'[^']*'|`[^`]*`|<\/?[A-Z][A-Za-z0-9.]*|<\/?[a-z][A-Za-z0-9.-]*|[A-Za-z_][A-Za-z0-9_]*(?==)|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b)/g,
    )
    .map((part, index) => {
      if (!part) return null;
      const key = `${part}-${index}`;

      if (part.startsWith("//") || part.startsWith("/*")) {
        return (
          <span className="text-code-comment" key={key}>
            {part}
          </span>
        );
      }

      if (/^["'`]/.test(part)) {
        return (
          <span className="text-code-string" key={key}>
            {part}
          </span>
        );
      }

      if (/^<\/?[A-Z]/.test(part)) {
        return (
          <span className="text-code-component" key={key}>
            {part}
          </span>
        );
      }

      if (/^<\/?[a-z]/.test(part)) {
        return (
          <span className="text-code-tag" key={key}>
            {part}
          </span>
        );
      }

      if (/^\d/.test(part)) {
        return (
          <span className="text-code-number" key={key}>
            {part}
          </span>
        );
      }

      if (tsxKeywords.has(part)) {
        return (
          <span className="text-code-keyword" key={key}>
            {part}
          </span>
        );
      }

      if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(part) && line.includes(`${part}=`)) {
        return (
          <span className="text-code-attr" key={key}>
            {part}
          </span>
        );
      }

      return part;
    });
}

function HighlightedCode({ children, language }: { children: string; language: CodeLanguage }) {
  return (
    <>
      {children.split("\n").map((line, index, lines) => (
        <span className="block min-h-5" key={`${line}-${index}`}>
          {highlightInlineCode(line, language)}
          {index < lines.length - 1 ? "\n" : null}
        </span>
      ))}
    </>
  );
}

function CodeBlock({
  children,
  className = "",
  language = "tsx",
}: {
  children: string;
  className?: string;
  language?: CodeLanguage;
}) {
  return (
    <pre
      className={[
        "max-w-full overflow-x-hidden overflow-y-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-lg border border-border bg-code p-4 font-mono text-sm leading-6 text-code-foreground shadow-sm",
        className,
      ].join(" ")}
    >
      <code>
        <HighlightedCode language={language}>{children}</HighlightedCode>
      </code>
    </pre>
  );
}

function ExamplePanel({ children, code }: { children: ReactNode; code: string }) {
  const [activeTab, setActiveTab] = useState<"code" | "preview">("preview");
  const [copied, setCopied] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!copied) return;

    const timeout = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }
  };

  return (
    <div className="min-w-0 max-w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Example</h3>
        <div
          aria-label="Example view"
          className="inline-flex rounded-[0.375rem] border border-border bg-surface p-0.5"
          role="tablist"
        >
          {(["preview", "code"] as const).map((tab) => (
            <button
              aria-controls={`${panelId}-${tab}-panel`}
              aria-selected={activeTab === tab}
              className={[
                "h-7 rounded-[0.25rem] px-3 text-xs font-medium capitalize transition-colors",
                activeTab === tab
                  ? "bg-muted text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
              key={tab}
              onClick={() => setActiveTab(tab)}
              id={`${panelId}-${tab}-tab`}
              role="tab"
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div
        aria-labelledby={`${panelId}-preview-tab`}
        className="min-w-0 max-w-full"
        hidden={activeTab !== "preview"}
        id={`${panelId}-preview-panel`}
        role="tabpanel"
      >
        <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-background p-6">
          {children}
        </div>
      </div>
      <div
        aria-labelledby={`${panelId}-code-tab`}
        className="min-w-0 max-w-full"
        hidden={activeTab !== "code"}
        id={`${panelId}-code-panel`}
        role="tabpanel"
      >
        <div className="min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-code shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
            <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-code-comment">
              TSX
            </span>
            <button
              aria-label={copied ? "Code copied" : "Copy code"}
              className="inline-grid size-8 shrink-0 place-items-center rounded-[0.25rem] bg-transparent text-white transition-[background-color,color,transform] hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={copyCode}
              title={copied ? "Copied" : "Copy code"}
              type="button"
            >
              {copied ? (
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  viewBox="0 0 16 16"
                >
                  <rect height="8" rx="1.5" width="8" x="5" y="5" />
                  <path d="M3 10.5V4.5A1.5 1.5 0 0 1 4.5 3h6" />
                </svg>
              )}
            </button>
          </div>
          <CodeBlock className="rounded-none border-0 shadow-none">{code}</CodeBlock>
        </div>
      </div>
    </div>
  );
}

const onboardingPreviewSteps = [
  {
    body: "Confirm the workspace name, region, and default team settings.",
    description: "Name and team defaults",
    heading: "Create workspace",
    title: "Workspace",
  },
  {
    body: "Connect Salesforce or upload a CSV. Nothing is written until fields are mapped.",
    description: "Bring in existing customers",
    heading: "Import customer records",
    title: "Import data",
  },
  {
    body: "Send invites now or copy a secure invite link for later.",
    description: "Add operators and reviewers",
    heading: "Invite team members",
    title: "Invite team",
  },
] as const;

const onboardingPreviewMethods = [
  ["Connect Salesforce", "Sync accounts and owners."],
  ["Upload CSV", "Review columns before import."],
] as const;

function OnboardingWizardInteractivePreview({ compact = false }: { compact?: boolean }) {
  const [activeStep, setActiveStep] = useState(1);
  const [method, setMethod] =
    useState<(typeof onboardingPreviewMethods)[number][0]>("Connect Salesforce");
  const currentStep = onboardingPreviewSteps[activeStep] ?? onboardingPreviewSteps[0];
  const progress = Math.round(((activeStep + 1) / onboardingPreviewSteps.length) * 100);

  return (
    <div className="overflow-hidden rounded-[0.75rem] border border-border bg-surface shadow-sm">
      <div className={compact ? "grid" : "grid md:grid-cols-[17rem_minmax(0,1fr)]"}>
        <div>
          <div className="border-b border-border p-5">
            <h3 className="text-lg font-semibold tracking-tight">Launch workspace</h3>
            <p className="mt-1 text-sm text-muted-foreground">Complete the setup checklist.</p>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Onboarding progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full origin-left rounded-full bg-primary transition-transform duration-[var(--brilliant-duration-normal)] ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none"
                  style={{ transform: `scaleX(${progress / 100})` }}
                />
              </div>
            </div>
          </div>
          <ol className="grid gap-2 border-b border-border p-4 md:border-r md:border-b-0">
            {onboardingPreviewSteps.map((step, index) => {
              const state =
                index < activeStep ? "complete" : index === activeStep ? "current" : "upcoming";

              return (
                <li className="list-none" key={step.title}>
                  <button
                    aria-current={state === "current" ? "step" : undefined}
                    className={[
                      "flex w-full items-start gap-3 rounded-[0.5rem] px-3 py-2.5 text-left text-sm transition-[background-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] hover:bg-muted active:scale-[0.99] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                      state === "current"
                        ? "bg-muted font-medium shadow-[inset_0_0_0_0.5px_var(--brilliant-control-border)]"
                        : "text-muted-foreground",
                    ].join(" ")}
                    onClick={() => setActiveStep(index)}
                    type="button"
                  >
                    <span
                      className={[
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                        state === "complete"
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : state === "current"
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background",
                      ].join(" ")}
                    >
                      {state === "complete" ? "✓" : index + 1}
                    </span>
                    <span>
                      <span className="block text-foreground">{step.title}</span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                        {step.description}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <section className="grid min-h-72 content-between gap-6 p-5">
          <div className="grid gap-4">
            <Badge tone="ready">
              Step {activeStep + 1} of {onboardingPreviewSteps.length}
            </Badge>
            <div>
              <h3 className="text-lg font-semibold">{currentStep.heading}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{currentStep.body}</p>
            </div>
            {activeStep === 1 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {onboardingPreviewMethods.map(([title, description]) => (
                  <button
                    aria-pressed={method === title}
                    className={[
                      "rounded-[0.5rem] border bg-background p-4 text-left transition-[background-color,border-color,box-shadow,transform] hover:-translate-y-px hover:border-primary/35 hover:shadow-sm active:translate-y-0 active:scale-[0.99]",
                      method === title ? "border-primary bg-primary/5 shadow-sm" : "border-border",
                    ].join(" ")}
                    key={title}
                    onClick={() => setMethod(title)}
                    type="button"
                  >
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <button
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-45"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
              type="button"
            >
              Back
            </button>
            <button
              className={`${buttonVariants[0][2]} h-9 rounded-[0.25rem] px-3.5 text-sm font-medium`}
              onClick={() =>
                setActiveStep((step) => Math.min(onboardingPreviewSteps.length - 1, step + 1))
              }
              type="button"
            >
              {activeStep === onboardingPreviewSteps.length - 1 ? "Finish" : "Continue"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductBlockPreview({ id }: { id: (typeof productBlockExamples)[number]["id"] }) {
  if (id === "workspace-import") {
    return <OnboardingWizardInteractivePreview />;
  }

  if (id === "api-keys") {
    return (
      <div className="rounded-[0.5rem] border border-border bg-surface p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">API keys</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage keys used by integrations and automations.
            </p>
          </div>
          <button
            className={`${buttonVariants[0][2]} h-8 rounded-[0.25rem] px-3 text-xs font-medium`}
            type="button"
          >
            Create key
          </button>
        </div>
        <div className="mt-5 divide-y divide-border rounded-[0.5rem] border border-border">
          {[
            ["Production", "Last used 2 minutes ago", "Live"],
            ["Staging", "Last used yesterday", "Scoped"],
          ].map(([name, detail, state]) => (
            <div className="flex items-center justify-between gap-3 p-3" key={name}>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
              <Badge tone={state === "Live" ? "ready" : "muted"}>{state}</Badge>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[0.5rem] border border-border bg-surface p-5 shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Current billing period</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">2.4M events</h3>
        </div>
        <button
          className="h-8 rounded-[0.25rem] border border-border px-3 text-xs font-medium"
          type="button"
        >
          Manage plan
        </button>
      </div>
      <div className="mt-5 grid gap-2">
        <div className="flex items-center justify-between text-sm">
          <span>Usage included</span>
          <span className="font-medium">64%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[64%] rounded-full bg-primary" />
        </div>
      </div>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["Seats", "48 active"],
          ["Renewal", "Aug 30"],
          ["Forecast", "12% below"],
        ].map(([term, value]) => (
          <div key={term}>
            <dt className="text-xs text-muted-foreground">{term}</dt>
            <dd className="text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function MiniTerminal({ children }: { children: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-foreground p-4 text-sm leading-6 text-background">
      <code>{children}</code>
    </pre>
  );
}

function SwitchPreview() {
  const [enabled, setEnabled] = useState(true);

  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="relative inline-grid h-6 w-10 shrink-0 place-items-center">
        <input
          aria-checked={enabled}
          aria-label="Enable sync"
          checked={enabled}
          className="peer absolute inset-0 z-10 h-6 w-10 cursor-pointer appearance-none rounded-full opacity-0"
          onChange={(event) => setEnabled(event.currentTarget.checked)}
          role="switch"
          type="checkbox"
        />
        <span className="pointer-events-none h-6 w-10 rounded-full border border-transparent bg-secondary shadow-inner transition-[background-color,border-color,box-shadow] duration-[var(--brilliant-duration-fast)] peer-checked:bg-primary peer-checked:shadow-none peer-focus-visible:ring-1 peer-focus-visible:ring-ring" />
        <span className="pointer-events-none absolute left-0.5 size-5 rounded-full bg-surface shadow-sm transition-[transform,box-shadow] duration-[var(--brilliant-duration-normal)] ease-[var(--brilliant-ease-spring)] will-change-transform peer-active:scale-x-110 peer-active:scale-y-90 peer-checked:translate-x-4 peer-checked:shadow-sm" />
      </span>
      <span className="text-sm">{enabled ? "Enabled" : "Disabled"}</span>
    </label>
  );
}

function SelectPreview() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Owner");
  const options = ["Owner", "Admin", "Member"];

  return (
    <div className="grid max-w-sm gap-2">
      <span className="text-sm font-medium" id="select-preview-label">
        Workspace role
      </span>
      <div className="relative">
        <button
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby="select-preview-label"
          className={[
            "flex h-9 w-full items-center justify-between gap-2 rounded-[0.25rem] border-0 bg-background px-3 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]",
            "outline-none transition-[background-color,box-shadow] duration-[var(--brilliant-duration-fast)] hover:bg-muted/50 focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)]",
            open ? "shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)]" : "",
          ].join(" ")}
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span>{value}</span>
          <svg
            aria-hidden="true"
            className={[
              "size-4 shrink-0 text-muted-foreground transition-transform duration-[var(--brilliant-duration-fast)]",
              open ? "rotate-180" : "",
            ].join(" ")}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 16 16"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
        {open ? (
          <div
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-[0.375rem] border-hairline border-border bg-surface p-1 text-sm text-foreground shadow-md motion-safe:animate-enter motion-reduce:animate-none"
            role="listbox"
          >
            {options.map((option) => (
              <button
                aria-selected={value === option}
                className={[
                  "relative flex w-full items-center rounded-[0.25rem] py-1.5 pr-8 pl-8 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
                  value === option ? "font-medium" : "",
                ].join(" ")}
                key={option}
                onClick={() => {
                  setValue(option);
                  setOpen(false);
                }}
                role="option"
                type="button"
              >
                <span className="absolute left-2 grid size-4 place-items-center text-primary">
                  {value === option ? (
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.25"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3.5 8.25 6.5 11l6-6" />
                    </svg>
                  ) : null}
                </span>
                {option}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ComboboxPreview() {
  const [open, setOpen] = useState(true);
  const [value, setValue] = useState("Acme");
  const options = ["Acme", "Brilliant", "Unifabriq"];
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(value.trim().toLowerCase()),
  );

  return (
    <div className="grid max-w-sm gap-2">
      <label className="text-sm font-medium" htmlFor="combobox-preview-workspace">
        Search workspace
      </label>
      <div className="relative">
        <input
          aria-autocomplete="list"
          aria-controls="combobox-preview-listbox"
          aria-expanded={open}
          className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 pr-9 text-sm text-foreground shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow placeholder:text-muted-foreground focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)]"
          id="combobox-preview-workspace"
          onChange={(event) => {
            setValue(event.currentTarget.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search workspace"
          role="combobox"
          value={value}
        />
        <svg
          aria-hidden="true"
          className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 16 16"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
        {open ? (
          <div
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-[0.375rem] border-hairline border-border bg-surface p-1 text-sm text-foreground shadow-md motion-safe:animate-enter motion-reduce:animate-none"
            id="combobox-preview-listbox"
            role="listbox"
          >
            {filteredOptions.length ? (
              filteredOptions.map((option, index) => (
                <button
                  aria-selected={option === value}
                  className={[
                    "relative flex w-full items-center rounded-[0.25rem] py-1.5 pr-3 pl-8 text-left outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
                    index === 0 ? "bg-muted" : "",
                  ].join(" ")}
                  key={option}
                  onClick={() => {
                    setValue(option);
                    setOpen(false);
                  }}
                  role="option"
                  type="button"
                >
                  <span className="absolute left-2 grid size-4 place-items-center text-primary">
                    {option === value ? (
                      <svg
                        aria-hidden="true"
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                        viewBox="0 0 16 16"
                      >
                        <path d="M3.5 8.25 6.5 11l6-6" />
                      </svg>
                    ) : null}
                  </span>
                  {option}
                </button>
              ))
            ) : (
              <div className="px-2 py-2 text-sm text-muted-foreground">No results found.</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function CarouselPreview() {
  const slides = [
    ["Usage", "2.4M events", "Tracking 12% below forecast"],
    ["Billing", "$18.4K", "Renewal closes August 30"],
    ["Members", "48 seats", "6 pending invites"],
  ] as const;
  const [index, setIndex] = useState(0);

  return (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-[0.5rem] border-hairline border-border bg-surface">
        <div
          className="flex transition-transform duration-[var(--brilliant-duration-normal)] ease-[var(--brilliant-ease-standard)] motion-reduce:transition-none"
          style={{ transform: `translate3d(-${index * 100}%, 0, 0)` }}
        >
          {slides.map(([title, value, description]) => (
            <div className="min-w-0 shrink-0 grow-0 basis-full p-5" key={title}>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          aria-label="Previous slide"
          className="inline-flex size-8 items-center justify-center rounded-[0.25rem] border-hairline border-border bg-surface text-sm shadow-sm transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-muted active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          disabled={index === 0}
          onClick={() => setIndex((current) => Math.max(current - 1, 0))}
          type="button"
        >
          <span aria-hidden="true">‹</span>
        </button>
        <div className="flex items-center justify-center gap-1.5">
          {slides.map(([title], dotIndex) => (
            <button
              aria-current={index === dotIndex ? "true" : undefined}
              aria-label={`Go to ${title} slide`}
              className="size-1.5 rounded-full bg-muted-foreground/35 transition-[background-color,transform] aria-current:scale-125 aria-current:bg-primary"
              key={title}
              onClick={() => setIndex(dotIndex)}
              type="button"
            />
          ))}
        </div>
        <button
          aria-label="Next slide"
          className="inline-flex size-8 items-center justify-center rounded-[0.25rem] border-hairline border-border bg-surface text-sm shadow-sm transition-[background-color,box-shadow,transform] hover:-translate-y-px hover:bg-muted active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          disabled={index === slides.length - 1}
          onClick={() => setIndex((current) => Math.min(current + 1, slides.length - 1))}
          type="button"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </div>
  );
}

function TabsPreview() {
  const tabs = [
    ["overview", "Overview", "Workspace health, owner, and recent activity."],
    ["usage", "Usage", "Usage is trending 12% below the forecast."],
    ["billing", "Billing", "Renewal closes August 30 with 48 active seats."],
  ] as const;
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number][0]>("overview");
  const activeContent = tabs.find(([value]) => value === activeTab)?.[2];

  return (
    <div className="grid gap-3">
      <div className="inline-flex w-fit rounded-[0.375rem] bg-muted p-1" role="tablist">
        {tabs.map(([value, label]) => (
          <button
            aria-selected={activeTab === value}
            className={[
              "rounded-[0.25rem] px-3 py-1.5 text-sm font-medium outline-none transition-[background-color,color,box-shadow,transform]",
              "hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring active:scale-[0.98]",
              activeTab === value
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted-foreground",
            ].join(" ")}
            key={value}
            onClick={() => setActiveTab(value)}
            role="tab"
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className="rounded-[0.5rem] border-hairline border-border bg-surface p-4 text-sm motion-safe:animate-enter motion-reduce:animate-none"
        role="tabpanel"
      >
        {activeContent}
      </div>
    </div>
  );
}

function SheetPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-72 overflow-hidden rounded-[0.5rem] border border-border bg-background">
      <div className="grid gap-3 p-4">
        <div className="flex items-center justify-between rounded-[0.375rem] border border-border bg-surface p-3">
          <div>
            <p className="text-sm font-semibold">Acme workspace</p>
            <p className="mt-1 text-xs text-muted-foreground">Enterprise plan · 48 seats</p>
          </div>
          <button
            className="h-8 rounded-[0.25rem] bg-primary px-3 text-xs font-medium text-primary-foreground transition-[background-color,transform] hover:-translate-y-px hover:bg-primary/92 active:translate-y-0 active:scale-[0.98]"
            onClick={() => setOpen(true)}
            type="button"
          >
            Edit settings
          </button>
        </div>
        <div className="grid gap-2 text-xs text-muted-foreground">
          <div className="h-8 rounded-[0.25rem] bg-muted" />
          <div className="h-8 rounded-[0.25rem] bg-muted/70" />
          <div className="h-8 rounded-[0.25rem] bg-muted/50" />
        </div>
      </div>

      {open ? (
        <div className="absolute inset-0 bg-foreground/20 motion-safe:animate-enter motion-reduce:animate-none">
          <div className="absolute top-0 right-0 h-full w-72 border-l border-border bg-surface shadow-md motion-safe:animate-slide-in-from-right motion-reduce:animate-none">
            <div className="flex items-start justify-between gap-3 border-b border-border p-4">
              <div>
                <h3 className="text-sm font-semibold">Workspace settings</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Edit billing and access defaults without leaving the page.
                </p>
              </div>
              <button
                aria-label="Close sheet"
                className="grid size-7 place-items-center rounded-[0.25rem] text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="grid gap-3 p-4">
              <label className="grid gap-1.5 text-xs font-medium" htmlFor="sheet-preview-role">
                Default role
                <input
                  className="h-8 rounded-[0.25rem] border-0 bg-background px-2 shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]"
                  defaultValue="Member"
                  id="sheet-preview-role"
                  readOnly
                />
              </label>
              <label className="grid gap-1.5 text-xs font-medium" htmlFor="sheet-preview-seats">
                Seat limit
                <input
                  className="h-8 rounded-[0.25rem] border-0 bg-background px-2 shadow-[inset_0_0_0_1px_var(--brilliant-control-border)]"
                  defaultValue="50"
                  id="sheet-preview-seats"
                  readOnly
                />
              </label>
              <button
                className="mt-2 h-8 rounded-[0.25rem] bg-primary px-3 text-xs font-medium text-primary-foreground"
                onClick={() => setOpen(false)}
                type="button"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DropdownMenuPreview() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(true);

  return (
    <div className="relative flex justify-start pb-32">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="h-9 rounded-[0.25rem] bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-[background-color,transform] hover:-translate-y-px hover:bg-primary/92 active:translate-y-0 active:scale-[0.98]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        Workspace actions
      </button>
      {open ? (
        <div
          className="absolute top-11 left-0 z-20 min-w-56 rounded-[0.375rem] border-hairline border-border bg-surface p-1 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none"
          role="menu"
        >
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Actions</div>
          {["Open audit log", "Invite teammate"].map((item) => (
            <button
              className="block w-full rounded-[0.25rem] px-2 py-1.5 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
              key={item}
              role="menuitem"
              type="button"
            >
              {item}
            </button>
          ))}
          <div className="-mx-1 my-1 h-px bg-border" />
          <button
            aria-checked={compact}
            className="relative block w-full rounded-[0.25rem] py-1.5 pr-2 pl-8 text-left hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
            onClick={() => setCompact((current) => !current)}
            role="menuitemcheckbox"
            type="button"
          >
            <span className="absolute left-2 grid size-4 place-items-center text-primary">
              {compact ? "✓" : null}
            </span>
            Compact density
          </button>
        </div>
      ) : null}
    </div>
  );
}

function TablePreview() {
  const rows = [
    ["Acme", "Enterprise", "48", "Active"],
    ["Brilliant", "Team", "12", "Active"],
    ["Unifabriq", "Enterprise", "86", "Review"],
  ] as const;

  return (
    <div className="overflow-hidden rounded-[0.5rem] border border-border bg-surface">
      <table className="w-full border-collapse text-sm">
        <thead className="border-b border-border bg-muted/60">
          <tr>
            {["Workspace", "Plan", "Seats", "Status"].map((head) => (
              <th
                className="h-10 px-3 text-left text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground"
                key={head}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className="border-b border-border last:border-b-0 hover:bg-muted/50" key={row[0]}>
              {row.map((cell) => (
                <td className="px-3 py-3" key={cell}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormPreview() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="grid gap-4 rounded-[0.5rem] border-hairline border-border bg-surface p-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
    >
      <div className="grid gap-1">
        <h3 className="text-base font-semibold tracking-tight">Workspace settings</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          Defaults used for invites and billing.
        </p>
      </div>
      <label className="grid gap-2 text-sm font-medium" htmlFor="form-preview-name">
        Workspace name
        <input
          className="h-9 rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)]"
          defaultValue="Acme"
          id="form-preview-name"
        />
      </label>
      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          {saved ? "Saved just now." : "Unsaved changes."}
        </p>
        <button
          className="h-8 rounded-[0.25rem] bg-primary px-3 text-xs font-medium text-primary-foreground"
          type="submit"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

function ScrollAreaPreview() {
  return (
    <div className="h-48 overflow-hidden rounded-[0.5rem] border border-border bg-surface">
      <div className="h-full overflow-auto p-3 pr-2">
        <div className="grid gap-2">
          {Array.from({ length: 14 }).map((_, index) => (
            <div
              className="rounded-[0.25rem] border border-border bg-background px-3 py-2 text-sm"
              key={index}
            >
              Audit event {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToastPreview() {
  const [messages, setMessages] = useState([
    { id: "initial", title: "Settings saved", description: "Workspace policy updated." },
  ]);

  return (
    <div className="relative h-48 overflow-hidden rounded-[0.5rem] border border-border bg-background p-4">
      <button
        className="h-9 rounded-[0.25rem] bg-primary px-3.5 text-sm font-medium text-primary-foreground"
        onClick={() =>
          setMessages((current) =>
            [
              {
                id: String(Date.now()),
                title: "Invite sent",
                description: "teammate@company.com can now join Acme.",
              },
              ...current,
            ].slice(0, 3),
          )
        }
        type="button"
      >
        Trigger toast
      </button>
      <div className="absolute right-4 bottom-4 grid w-80 gap-2">
        {messages.map((message) => (
          <div
            className="flex items-start justify-between gap-3 rounded-[0.5rem] border-hairline border-primary/25 bg-surface p-4 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none"
            key={message.id}
            role="status"
          >
            <div>
              <p className="font-semibold tracking-tight">{message.title}</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{message.description}</p>
            </div>
            <button
              aria-label="Dismiss toast"
              className="grid size-7 shrink-0 place-items-center rounded-[0.25rem] text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() =>
                setMessages((current) => current.filter((item) => item.id !== message.id))
              }
              type="button"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const photoArchitectureImage = "/images/photo-architecture.jpg";

function PhotoPreviewFigure({
  alt,
  caption,
  crop = "rectangle",
  fallback = false,
  filter = "none",
  fit = "cover",
  ratio,
  radius = "md",
  src,
  tintColor,
  tintOpacity = 0.28,
  variant = "surface",
}: {
  alt: string;
  caption?: string;
  crop?: "circle" | "rectangle" | "square";
  fallback?: boolean;
  filter?: "cool" | "mono" | "none" | "soft" | "vivid" | "warm";
  fit?: "contain" | "cover";
  ratio: string;
  radius?: "full" | "lg" | "md" | "sm";
  src?: string;
  tintColor?: string;
  tintOpacity?: number;
  variant?: "elevated" | "ghost" | "surface";
}) {
  const variantClass = {
    elevated:
      "-translate-y-1 border-transparent bg-surface-raised shadow-[0_20px_42px_-18px_oklch(0_0_0/0.48),0_8px_18px_-12px_oklch(0_0_0/0.3)]",
    ghost: "border-transparent bg-transparent shadow-none",
    surface: "border-transparent bg-surface shadow-none ring-1 ring-inset ring-border",
  }[variant];
  const radiusClass = {
    full: "rounded-full",
    lg: "rounded-[0.75rem]",
    md: "rounded-[0.5rem]",
    sm: "rounded-[0.25rem]",
  }[radius];
  const filterStyle = {
    cool: "saturate(0.9) hue-rotate(8deg) contrast(1.02)",
    mono: "grayscale(1) contrast(1.05)",
    none: "none",
    soft: "saturate(0.82) contrast(0.94) brightness(1.04)",
    vivid: "saturate(1.22) contrast(1.06)",
    warm: "sepia(0.2) saturate(1.1) hue-rotate(-8deg)",
  }[filter];

  return (
    <figure
      className={`group relative isolate overflow-hidden border ${crop === "circle" ? "rounded-full" : radiusClass} ${variantClass}`}
      style={{ aspectRatio: crop === "rectangle" ? ratio : "1" }}
    >
      <div className="absolute inset-0 grid place-items-center bg-muted px-4 text-center text-sm text-muted-foreground">
        <span className="grid gap-2">
          <span aria-hidden="true" className="text-lg leading-none text-muted-foreground/70">
            ◌
          </span>
          {fallback ? "Image unavailable" : "Loading preview"}
        </span>
      </div>
      {!fallback && src ? (
        <img
          alt={alt}
          className={`absolute inset-0 size-full ${fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-[var(--brilliant-duration-normal)] group-hover:scale-[1.015] motion-reduce:transition-none`}
          src={src}
          style={{ filter: filterStyle }}
        />
      ) : null}
      {tintColor ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ backgroundColor: tintColor, mixBlendMode: "color", opacity: tintOpacity }}
        />
      ) : null}
      {caption ? (
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/75 to-transparent px-3 pt-8 pb-3 text-xs font-medium text-background">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function PhotoExamplePreview({ example }: { example: keyof typeof photoExampleCode }) {
  if (example === "variants") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {(["surface", "elevated", "ghost"] as const).map((variant) => (
          <div className="grid gap-2" key={variant}>
            <PhotoPreviewFigure
              alt="Sunlit concrete atrium"
              caption={variant}
              ratio="16/10"
              src={photoArchitectureImage}
              variant={variant}
            />
            <code className="text-center text-xs text-muted-foreground">{`variant="${variant}"`}</code>
          </div>
        ))}
      </div>
    );
  }

  if (example === "crops") {
    return (
      <div className="grid items-end gap-5 sm:grid-cols-3">
        {(
          [
            ["rectangle", "4 / 3 rectangle", "sm"],
            ["square", "1 / 1 square", "lg"],
            ["circle", "1 / 1 circle", "full"],
          ] as const
        ).map(([crop, label, radius]) => (
          <div className="grid gap-2" key={crop}>
            <PhotoPreviewFigure
              alt={`${label} atrium crop`}
              crop={crop}
              ratio="4/3"
              radius={radius}
              src={photoArchitectureImage}
            />
            <code className="text-center text-xs text-muted-foreground">{`crop="${crop}"`}</code>
          </div>
        ))}
      </div>
    );
  }

  if (example === "filters") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(
          [
            ["none", "Original", undefined],
            ["mono", "Mono", undefined],
            ["warm", "Warm", undefined],
            ["soft", "Indigo tint", "var(--brilliant-primary)"],
          ] as const
        ).map(([filter, label, tintColor]) => (
          <div className="grid gap-2" key={label}>
            <PhotoPreviewFigure
              alt={`${label} atrium`}
              filter={filter}
              ratio="4/3"
              src={photoArchitectureImage}
              {...(tintColor ? { tintColor } : {})}
            />
            <span className="text-center text-xs font-medium text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (example === "ratios") {
    return (
      <div className="grid items-end gap-4 sm:grid-cols-3">
        <PhotoPreviewFigure
          alt="Square atrium crop"
          caption="1:1 architectural crop"
          ratio="1"
          src={photoArchitectureImage}
        />
        <PhotoPreviewFigure
          alt="Portrait atrium crop"
          caption="3:4 architectural crop"
          ratio="3/4"
          src={photoArchitectureImage}
        />
        <PhotoPreviewFigure
          alt="Wide atrium view"
          caption="16:9 architectural view"
          ratio="16/9"
          src={photoArchitectureImage}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="grid gap-2">
        <PhotoPreviewFigure
          alt="Concrete atrium detail"
          ratio="16/10"
          src={photoArchitectureImage}
        />
        <p className="text-center text-xs text-muted-foreground">fit=&quot;cover&quot;</p>
      </div>
      <div className="grid gap-2">
        <PhotoPreviewFigure
          alt="Full concrete atrium"
          fit="contain"
          ratio="16/10"
          src={photoArchitectureImage}
        />
        <p className="text-center text-xs text-muted-foreground">fit=&quot;contain&quot;</p>
      </div>
      <div className="grid gap-2">
        <PhotoPreviewFigure alt="Unavailable report" fallback ratio="16/10" />
        <p className="text-center text-xs text-muted-foreground">failed image fallback</p>
      </div>
    </div>
  );
}

function HeaderPreview() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-20 w-full border-b border-border bg-background/95 text-foreground backdrop-blur">
      <div className="relative mx-auto flex min-h-14 max-w-screen-2xl items-center gap-3 px-4 md:px-6">
        <a className="font-semibold tracking-[-0.015em]" href="#header-preview">
          Brilliant
        </a>
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          className="ml-auto inline-grid size-9 place-items-center rounded-[0.25rem] hover:bg-muted active:scale-[0.97] md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <span aria-hidden="true" className="grid gap-1">
            <span
              className={`block h-px w-4 bg-current transition-transform ${menuOpen ? "translate-y-[2.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-4 bg-current transition-transform ${menuOpen ? "-translate-y-[2.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
        <nav
          aria-label="Primary navigation"
          className={[
            "absolute inset-x-0 top-full grid gap-1 border-b border-border bg-background p-3 shadow-md",
            menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
            "md:static md:ml-4 md:flex md:visible md:translate-y-0 md:items-center md:border-0 md:bg-transparent md:p-0 md:opacity-100 md:shadow-none",
          ].join(" ")}
        >
          {[
            ["Dashboard", true],
            ["Projects", false],
            ["Settings", false],
          ].map(([label, active]) => (
            <a
              aria-current={active ? "page" : undefined}
              className={`rounded-[0.25rem] px-3 py-2 text-sm ${active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              href={`#header-${String(label).toLowerCase()}`}
              key={String(label)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <button
            className="h-8 rounded-[0.25rem] bg-primary px-3 text-xs font-medium text-primary-foreground hover:-translate-y-px active:translate-y-0 active:scale-[0.99]"
            type="button"
          >
            New project
          </button>
        </div>
      </div>
    </header>
  );
}

function FooterPreview() {
  return (
    <footer className="w-full border-t border-border bg-background text-sm text-muted-foreground">
      <div className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <div>
            <a className="font-semibold tracking-[-0.015em] text-foreground" href="#footer-brand">
              Brilliant UI
            </a>
            <p className="mt-3 max-w-sm leading-6">
              App-owned components with enterprise defaults and built-in micro UX.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {[
              ["Product", "Components", "Blocks"],
              ["Resources", "Documentation", "Changelog"],
              ["Company", "About", "Contact"],
            ].map(([title, ...links]) => (
              <div className="grid content-start gap-2" key={title}>
                <h4 className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                  {title}
                </h4>
                {links.map((link) => (
                  <a
                    className="w-fit leading-6 hover:text-foreground"
                    href="#footer-link"
                    key={link}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Brilliant UI</span>
          <div className="flex gap-4">
            <a className="hover:text-foreground" href="#footer-privacy">
              Privacy
            </a>
            <a className="hover:text-foreground" href="#footer-terms">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function PhotoUploadPreview() {
  const [photo, setPhoto] = useState<File | null>(null);

  return (
    <PhotoUpload
      alt="Workspace profile"
      className="mx-auto max-w-lg"
      crop="square"
      file={photo}
      maxSize={5 * 1024 * 1024}
      onFileChange={setPhoto}
    />
  );
}

function ComponentMiniPreview({ name }: { name: string }) {
  if (name === "header") {
    return <HeaderPreview />;
  }

  if (name === "footer") {
    return <FooterPreview />;
  }

  if (name === "photo-upload") {
    return <PhotoUploadPreview />;
  }

  if (name === "button-group") {
    return (
      <div className="inline-flex flex-row items-stretch [&>*]:relative [&>*]:z-0 [&>*:focus-visible]:z-10 [&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none">
        {[
          ["Compact", "border border-border bg-surface text-foreground"],
          ["Comfortable", "bg-primary text-primary-foreground"],
          ["Touch", "border border-border bg-surface text-foreground"],
        ].map(([label, className]) => (
          <button
            className={[
              "h-9 rounded-[0.375rem] px-3.5 text-sm font-medium transition-[background-color,border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] hover:-translate-y-px active:translate-y-0 active:scale-[0.99]",
              className,
            ].join(" ")}
            key={label}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    );
  }

  if (name === "badge") {
    return (
      <div className="flex flex-wrap gap-2">
        <span className="rounded-[0.25rem] border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
          Live
        </span>
        <span className="rounded-[0.25rem] border border-border bg-muted px-2 py-1 text-xs font-medium">
          Enterprise
        </span>
      </div>
    );
  }

  if (name === "aspect-ratio") {
    return (
      <div className="max-w-md">
        <div
          className="relative overflow-hidden rounded-[0.5rem] bg-muted"
          style={{ aspectRatio: "16/9" }}
        >
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--brilliant-primary)_0%,oklch(0.42_0.18_276)_100%)] text-primary-foreground">
            <span className="rounded-[0.375rem] bg-background/15 px-2 py-1 text-xs font-medium backdrop-blur">
              16:9 preview
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (name === "photo") {
    return (
      <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr]">
        <figure className="group relative isolate aspect-[16/10] overflow-hidden rounded-[0.5rem] border border-border bg-surface shadow-sm transition-[border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] hover:-translate-y-px hover:border-primary/30 hover:shadow-md motion-reduce:transition-none">
          <div className="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground">
            Preview loading
          </div>
          <img
            alt="Sunlit concrete atrium"
            className="absolute inset-0 size-full object-cover transition-transform duration-[var(--brilliant-duration-normal)] group-hover:scale-[1.015] motion-reduce:transition-none"
            src={photoArchitectureImage}
            style={{ filter: "saturate(0.82) contrast(0.94) brightness(1.04)" }}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-primary opacity-[0.12] mix-blend-color"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 to-transparent px-3 pt-8 pb-3 text-xs font-medium text-background">
            Sunlit concrete atrium
          </figcaption>
        </figure>
        <div className="grid gap-3">
          {[
            ["surface", "Default media in cards and grids."],
            ["elevated", "Prominent gallery or hero preview."],
            ["ghost", "Flush media inside an existing panel."],
          ].map(([variant, description]) => (
            <div className="rounded-[0.375rem] border border-border bg-surface p-3" key={variant}>
              <p className="font-mono text-xs">{`variant="${variant}"`}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "avatar") {
    return (
      <div className="flex items-end gap-4">
        {[
          ["sm", "size-7 text-xs", "size-2"],
          ["md", "size-9 text-sm", "size-2.5"],
          ["lg", "size-11 text-base", "size-3"],
          ["xl", "size-14 text-lg", "size-3.5"],
        ].map(([label, rootSize, statusSize]) => (
          <div
            className={[
              "relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted font-medium uppercase text-muted-foreground shadow-[inset_0_0_0_0.5px_var(--brilliant-control-border)]",
              rootSize,
            ].join(" ")}
            key={label}
          >
            <span className="grid size-full place-items-center overflow-hidden rounded-full">
              AR
            </span>
            <img
              alt="Alex Rivera"
              className="absolute inset-0 size-full rounded-full object-cover motion-safe:animate-enter motion-reduce:animate-none"
              src="/images/avatar-product-designer.jpg"
            />
            <span
              aria-label="online"
              className={[
                "absolute right-0 bottom-0 rounded-full border-2 border-background bg-primary shadow-sm",
                statusSize,
              ].join(" ")}
              role="status"
            />
          </div>
        ))}
      </div>
    );
  }

  if (name === "card") {
    return (
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["Surface", "Neutral group", "border-border bg-surface shadow-sm"],
          ["Elevated", "Dashboard metric", "border-border bg-surface-raised shadow-md"],
          ["Accent", "Selected state", "border-primary/25 bg-primary/5 shadow-sm"],
          [
            "Beam",
            "Live premium state",
            "relative isolate overflow-hidden border-transparent bg-surface shadow-sm before:absolute before:-inset-8 before:z-0 before:rounded-[inherit] before:bg-[conic-gradient(from_0deg,transparent_0_68%,var(--brilliant-ring)_74%,var(--brilliant-primary)_79%,transparent_86%)] before:opacity-70 before:content-[''] motion-safe:before:animate-border-beam motion-reduce:before:animate-none after:absolute after:inset-[0.5px] after:z-0 after:rounded-[calc(0.375rem-0.5px)] after:bg-surface after:content-[''] [&>*]:relative [&>*]:z-10",
          ],
        ].map(([title, description, className]) => (
          <div
            className={[
              "rounded-[0.375rem] border p-3 transition-[border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] hover:-translate-y-px hover:border-primary/30 hover:shadow-md active:translate-y-0 active:scale-[0.995]",
              className,
            ].join(" ")}
            key={title}
          >
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    );
  }

  if (name === "text") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Default", "Revenue intelligence", "text-foreground"],
          ["Muted", "Updated 2 minutes ago", "text-muted-foreground"],
          ["Glow", "AI ready", "text-primary drop-shadow-[0_0_14px_var(--brilliant-primary)]"],
          [
            "Shimmer",
            "Generating workspace insights",
            "bg-[linear-gradient(110deg,var(--brilliant-text-shimmer-base)_0%,var(--brilliant-text-shimmer-text)_18%,var(--brilliant-text-shimmer-highlight)_34%,var(--brilliant-text-shimmer-text)_50%,var(--brilliant-text-shimmer-base)_66%)] bg-[length:240%_100%] bg-clip-text text-transparent motion-safe:animate-text-shimmer motion-reduce:animate-none motion-reduce:bg-none motion-reduce:text-foreground",
          ],
        ].map(([label, copy, className]) => (
          <div className="rounded-[0.375rem] border border-border bg-surface p-4" key={label}>
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
              {label}
            </p>
            <p className={["mt-2 text-lg font-medium tracking-[-0.01em]", className].join(" ")}>
              {copy}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (name === "file-upload") {
    return (
      <FileUpload accept=".csv,text/csv" maxFiles={3} maxSize={5 * 1024 * 1024} multiple>
        <FileUploadDropzone>
          <span>
            <FileUploadIcon />
            <FileUploadTitle>Drop CSV files here or click to browse</FileUploadTitle>
            <FileUploadDescription>Up to 3 files, 5 MB each.</FileUploadDescription>
          </span>
        </FileUploadDropzone>
        <FileUploadList />
        <FileUploadError />
      </FileUpload>
    );
  }

  if (name === "input") {
    return (
      <input
        className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
        autoComplete="off"
        name="brilliant-input-preview"
        placeholder="Acme workspace"
      />
    );
  }

  if (name === "label") {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="label-preview-workspace">
          Workspace name
        </label>
        <input
          className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
          defaultValue="Acme"
          id="label-preview-workspace"
        />
      </div>
    );
  }

  if (name === "textarea") {
    return (
      <textarea
        className="min-h-20 w-full resize-none appearance-none rounded-[0.25rem] border-0 bg-background px-3 py-2 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
        placeholder="Add a launch note..."
      />
    );
  }

  if (name === "field") {
    return (
      <div className="grid max-w-md gap-2">
        <label className="text-sm font-medium leading-none" htmlFor="field-preview-email">
          Workspace email
        </label>
        <input
          className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none transition-shadow focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)] focus-visible:ring-0"
          defaultValue="workspace@company.com"
          id="field-preview-email"
          type="email"
        />
        <p className="text-xs leading-5 text-muted-foreground">Used for billing and approvals.</p>
      </div>
    );
  }

  if (name === "checkbox") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Checked", "Require approval", "checked"],
          ["Empty", "Optional export", "empty"],
          ["Mixed", "3 of 8 selected", "mixed"],
        ].map(([label, copy, state]) => (
          <label className="flex items-center gap-4 text-sm" key={label}>
            <span className="relative inline-grid size-6 shrink-0 place-items-center">
              <input
                aria-label={label}
                className="peer absolute inset-0 z-10 size-6 cursor-pointer appearance-none rounded-[0.375rem] opacity-0"
                defaultChecked={state === "checked"}
                ref={(node) => {
                  if (node) node.indeterminate = state === "mixed";
                }}
                type="checkbox"
              />
              <span className="pointer-events-none grid size-6 place-items-center rounded-[0.375rem] border border-control-border bg-background shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent),inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_12%,transparent)] transition-[background-color,border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] peer-active:scale-[0.92] peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-indeterminate:border-primary peer-indeterminate:bg-primary peer-indeterminate:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-checked:[&_[data-check]]:opacity-100 peer-checked:[&_[data-check]]:scale-100 peer-indeterminate:[&_[data-check]]:hidden peer-indeterminate:[&_[data-mixed]]:opacity-100 peer-indeterminate:[&_[data-mixed]]:scale-100">
                <svg
                  aria-hidden="true"
                  className="size-4 scale-75 text-primary-foreground opacity-0 transition-[opacity,transform] duration-[var(--brilliant-duration-fast)]"
                  data-check=""
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.75 8.25 6.5 11l5.75-6" />
                </svg>
                <svg
                  aria-hidden="true"
                  className="absolute size-4 scale-75 text-primary-foreground opacity-0 transition-[opacity,transform] duration-[var(--brilliant-duration-fast)]"
                  data-mixed=""
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  viewBox="0 0 16 16"
                >
                  <path d="M4 8h8" />
                </svg>
              </span>
            </span>
            <span>
              <span className="block font-medium tracking-[-0.01em]">{label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{copy}</span>
            </span>
          </label>
        ))}
      </div>
    );
  }

  if (name === "switch") {
    return <SwitchPreview />;
  }

  if (name === "radio-group") {
    return (
      <fieldset aria-label="Billing plan" className="grid gap-3">
        {(
          [
            ["pro", "Pro", "Usage, members, and API controls", true],
            ["enterprise", "Enterprise", "SAML, SCIM, audit logs", false],
          ] as const
        ).map(([value, label, description, checked]) => (
          <label className="group/radio flex cursor-pointer items-start gap-3 text-sm" key={value}>
            <span className="relative mt-0.5 inline-grid size-5 shrink-0 place-items-center">
              <input
                className="peer absolute inset-0 z-10 size-5 cursor-pointer appearance-none rounded-full opacity-0"
                defaultChecked={Boolean(checked)}
                name="preview-plan"
                type="radio"
                value={String(value)}
              />
              <span className="pointer-events-none grid size-5 place-items-center rounded-full border border-control-border bg-background shadow-[inset_0_1px_0_color-mix(in_oklch,white_70%,transparent),inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_12%,transparent)] transition-[background-color,border-color,box-shadow,transform] duration-[var(--brilliant-duration-fast)] peer-active:scale-[0.9] peer-checked:border-primary peer-checked:bg-primary peer-checked:shadow-[inset_0_1px_0_color-mix(in_oklch,white_22%,transparent),0_1px_2px_oklch(0_0_0/0.08)] peer-focus-visible:ring-1 peer-focus-visible:ring-ring peer-checked:[&_[data-indicator]]:scale-100 peer-checked:[&_[data-indicator]]:opacity-100">
                <span
                  className="size-2 scale-50 rounded-full bg-primary-foreground opacity-0 transition-[opacity,transform] duration-[var(--brilliant-duration-fast)]"
                  data-indicator=""
                />
              </span>
            </span>
            <span className="grid gap-0.5">
              <span className="font-medium tracking-[-0.01em]">{label}</span>
              <span className="text-xs text-muted-foreground">{description}</span>
            </span>
          </label>
        ))}
      </fieldset>
    );
  }

  if (name === "slider") {
    return (
      <div className="grid max-w-md gap-3">
        <div className="flex items-center justify-between text-sm">
          <label className="font-medium" htmlFor="slider-preview-threshold">
            Usage threshold
          </label>
          <span className="text-muted-foreground">64%</span>
        </div>
        <input
          aria-label="Usage threshold"
          className={[
            "h-5 w-full cursor-pointer appearance-none bg-transparent accent-primary",
            "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-muted",
            "[&::-webkit-slider-thumb]:mt-[-7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-hairline [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm",
            "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-muted",
            "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-hairline [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          ].join(" ")}
          defaultValue={64}
          id="slider-preview-threshold"
          max={100}
          min={0}
          type="range"
        />
      </div>
    );
  }

  if (name === "select") {
    return <SelectPreview />;
  }

  if (name === "combobox") {
    return <ComboboxPreview />;
  }

  if (name === "alert") {
    return (
      <div className="rounded-[0.375rem] border border-primary/25 bg-primary/10 p-3 text-sm">
        <p className="font-semibold">Sync complete</p>
        <p className="mt-1 text-xs text-muted-foreground">All records are current.</p>
      </div>
    );
  }

  if (name === "dialog") {
    return (
      <div className="mx-auto max-w-md rounded-[0.5rem] border-hairline border-border bg-surface shadow-md motion-safe:animate-enter motion-reduce:animate-none">
        <div className="border-b border-border p-4">
          <h3 className="text-base font-semibold tracking-tight">Invite teammate</h3>
          <p className="mt-1 text-sm text-muted-foreground">Send access to this workspace.</p>
        </div>
        <div className="p-4">
          <input
            className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none"
            placeholder="teammate@company.com"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-border p-4">
          <button className="h-8 rounded-[0.25rem] px-3 text-xs hover:bg-muted" type="button">
            Cancel
          </button>
          <button
            className={`${buttonVariants[0][2]} h-8 rounded-[0.25rem] px-3 text-xs`}
            type="button"
          >
            Send invite
          </button>
        </div>
      </div>
    );
  }

  if (name === "alert-dialog") {
    return (
      <div className="mx-auto max-w-md rounded-[0.5rem] border-hairline border-critical/30 bg-surface p-4 shadow-md motion-safe:animate-enter motion-reduce:animate-none">
        <h3 className="text-base font-semibold tracking-tight">Delete API key?</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This immediately revokes access for connected services.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="h-8 rounded-[0.25rem] px-3 text-xs hover:bg-muted" type="button">
            Cancel
          </button>
          <button
            className="h-8 rounded-[0.25rem] bg-critical px-3 text-xs font-medium text-critical-foreground"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  if (name === "drawer") {
    return (
      <div className="relative h-52 overflow-hidden rounded-[0.5rem] border border-border bg-muted/40">
        <div className="absolute inset-x-6 bottom-0 rounded-t-[0.5rem] border-hairline border-border bg-surface p-4 shadow-md">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30" />
          <h3 className="text-sm font-semibold">Usage filters</h3>
          <p className="mt-1 text-xs text-muted-foreground">Bottom drawer for mobile workflows.</p>
        </div>
      </div>
    );
  }

  if (name === "sheet") {
    return <SheetPreview />;
  }

  if (name === "dropdown-menu") {
    return <DropdownMenuPreview />;
  }

  if (name === "tooltip") {
    return (
      <div className="flex justify-center py-8">
        <span className="relative inline-flex">
          <button
            className="h-9 rounded-[0.25rem] border border-border bg-surface px-3 text-sm font-medium"
            type="button"
          >
            API key
          </button>
          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 -translate-y-0.5 whitespace-nowrap rounded-[0.25rem] bg-foreground px-2 py-1 text-xs font-medium text-background shadow-sm">
            Copied on click
          </span>
        </span>
      </div>
    );
  }

  if (name === "popover" || name === "hover-card") {
    return (
      <div className="flex items-start gap-3">
        <button
          className="h-9 rounded-[0.25rem] border border-border bg-surface px-3 text-sm font-medium"
          type="button"
        >
          {name === "popover" ? "Open filters" : "Hover user"}
        </button>
        <div className="min-w-56 rounded-[0.5rem] border-hairline border-border bg-surface p-3 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none">
          <p className="font-medium">{name === "popover" ? "Filters" : "Nirvana R"}</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {name === "popover"
              ? "Status, owner, and date controls."
              : "Workspace owner · active now."}
          </p>
        </div>
      </div>
    );
  }

  if (name === "context-menu") {
    return (
      <div className="relative max-w-sm rounded-[0.5rem] border border-dashed border-border bg-muted/30 p-4 text-sm">
        Right-click target
        <div className="absolute top-10 left-8 min-w-44 rounded-[0.5rem] border-hairline border-border bg-surface p-1 text-sm shadow-md motion-safe:animate-enter motion-reduce:animate-none">
          {["Open", "Rename", "Archive"].map((item) => (
            <button
              className="block w-full rounded-[0.25rem] px-2 py-1.5 text-left hover:bg-muted"
              key={item}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (name === "separator") {
    return (
      <div className="space-y-3 text-sm">
        <p>Account</p>
        <div className="h-[0.5px] w-full bg-primary" />
        <p className="text-muted-foreground">Billing</p>
      </div>
    );
  }

  if (name === "tabs") {
    return <TabsPreview />;
  }

  if (name === "accordion" || name === "collapsible") {
    return (
      <div className="divide-y divide-border rounded-[0.5rem] border-hairline border-border">
        <details className="group" open>
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium hover:bg-muted">
            {name === "accordion" ? "What ships with Brilliant?" : "Advanced settings"}
          </summary>
          <div className="px-4 pb-4 text-sm leading-6 text-muted-foreground motion-safe:animate-enter motion-reduce:animate-none">
            Built-in tokens, micro UX, and app-owned shadcn-compatible source.
          </div>
        </details>
      </div>
    );
  }

  if (name === "carousel") {
    return <CarouselPreview />;
  }

  if (name === "table") {
    return <TablePreview />;
  }

  if (name === "form") {
    return <FormPreview />;
  }

  if (name === "scroll-area") {
    return <ScrollAreaPreview />;
  }

  if (name === "breadcrumb") {
    return (
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {["Workspace", "Settings", "API keys"].map((item, index) => (
            <li className="inline-flex items-center gap-1" key={item}>
              <span className={index === 2 ? "font-medium text-foreground" : ""}>{item}</span>
              {index < 2 ? <span aria-hidden="true">/</span> : null}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  if (name === "navigation-menu") {
    return (
      <nav className="flex flex-wrap items-center gap-1">
        {["Dashboard", "Usage", "Settings"].map((item, index) => (
          <a
            className={[
              "rounded-[0.25rem] px-3 py-2 text-sm",
              index === 0 ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted",
            ].join(" ")}
            href="#components"
            key={item}
          >
            {item}
          </a>
        ))}
      </nav>
    );
  }

  if (name === "menubar") {
    return (
      <div
        className="flex w-fit items-center gap-1 rounded-[0.375rem] border-hairline border-border bg-surface p-1"
        role="menubar"
      >
        {["File", "Edit", "View"].map((item) => (
          <button
            className="rounded-[0.25rem] px-3 py-1.5 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            key={item}
            role="menuitem"
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
    );
  }

  if (name === "pagination") {
    return (
      <nav aria-label="Pagination">
        <ul className="flex items-center gap-1">
          {["‹", "1", "2", "3", "›"].map((item, index) => (
            <li key={`${item}-${index}`}>
              <a
                aria-current={item === "2" ? "page" : undefined}
                className="inline-flex size-9 items-center justify-center rounded-[0.25rem] text-sm hover:bg-muted aria-current:bg-primary aria-current:text-primary-foreground"
                href="#components"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (name === "toast") {
    return <ToastPreview />;
  }

  if (name === "calendar") {
    return (
      <table className="w-full max-w-xs border-collapse text-center text-sm">
        <caption className="mb-3 text-left font-medium">August 2026</caption>
        <thead className="text-xs text-muted-foreground">
          <tr>
            {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
              <th className="p-1 font-medium" key={day}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["", "", "", "", "", "1", "2"],
            ["3", "4", "5", "6", "7", "8", "9"],
            ["10", "11", "12", "13", "14", "15", "16"],
            ["17", "18", "19", "20", "21", "22", "23"],
          ].map((week) => (
            <tr key={week.join("-")}>
              {week.map((day, index) => (
                <td className="p-1" key={`${day || "empty"}-${index}`}>
                  {day ? (
                    <button
                      className={[
                        "size-8 rounded-[0.25rem] text-sm hover:bg-muted",
                        day === "19" ? "bg-primary text-primary-foreground hover:bg-primary" : "",
                      ].join(" ")}
                      type="button"
                    >
                      {day}
                    </button>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  if (name === "date-input") {
    return (
      <div className="grid max-w-sm gap-2">
        <label className="text-sm font-medium" htmlFor="date-input-preview">
          Renewal date
        </label>
        <input
          className="h-9 w-full appearance-none rounded-[0.25rem] border-0 bg-background px-3 text-sm shadow-[inset_0_0_0_1px_var(--brilliant-control-border)] outline-none focus-visible:shadow-[inset_0_0_0_1px_var(--brilliant-control-focus)]"
          defaultValue="2026-08-19"
          id="date-input-preview"
          type="date"
        />
      </div>
    );
  }

  if (name === "command") {
    return (
      <div className="max-w-md overflow-hidden rounded-[0.5rem] border-hairline border-border bg-surface shadow-sm">
        <input
          className="h-10 w-full border-b border-border bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Search commands..."
        />
        <div className="max-h-72 overflow-auto p-1" role="listbox">
          {["Invite teammate", "Create API key", "Open audit log"].map((item, index) => (
            <div
              className={[
                "rounded-[0.25rem] px-2 py-1.5 text-sm hover:bg-muted",
                index === 0 ? "bg-muted" : "",
              ].join(" ")}
              key={item}
              role="option"
              tabIndex={0}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "application-shell") {
    return (
      <div className="overflow-hidden rounded-[0.5rem] border border-border bg-background shadow-sm">
        <div className="grid min-h-[32rem] md:grid-cols-[17.5rem_minmax(0,1fr)]">
          <aside className="border-b border-border bg-background p-4 md:border-b-0 md:border-r">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full border border-border bg-surface text-sm font-semibold">
                B
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Brilliant</div>
                <div className="text-xs text-muted-foreground">Component system</div>
              </div>
            </div>
            <div className="mb-4 flex h-9 items-center gap-2 rounded-[0.375rem] border border-border bg-surface px-3 text-sm text-muted-foreground shadow-sm">
              <span aria-hidden="true">⌕</span>
              <span className="flex-1">Search docs</span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[0.65rem]">
                /
              </kbd>
            </div>
            <div className="grid gap-4">
              <section className="grid gap-1">
                <h4 className="px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Main
                </h4>
                <div className="grid gap-0.5">
                  {["Contracts", "Analysts", "Setting"].map((item, index) => (
                    <div
                      className={[
                        "flex items-center gap-3 rounded-[0.375rem] px-2 py-1.5 text-sm",
                        index === 0 ? "font-medium text-foreground" : "text-muted-foreground",
                      ].join(" ")}
                      key={item}
                    >
                      <span className="grid size-5 place-items-center rounded-[0.3125rem] border border-border bg-background text-[0.55rem]">
                        □
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>
              <section className="grid gap-1.5">
                <h4 className="px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Inboxes
                </h4>
                {(
                  [
                    ["Clients", "(209) 555-0104", "bg-primary/10 text-primary"],
                    ["Personal", "(239) 555-0108", "bg-amber-500/10 text-amber-700"],
                  ] satisfies Array<[string, string, string]>
                ).map(([title, description, tone]) => (
                  <div className="flex items-center gap-3 rounded-[0.5rem] px-2 py-2" key={title}>
                    <span
                      className={[
                        "grid size-10 place-items-center rounded-full border border-border text-sm font-semibold",
                        tone,
                      ].join(" ")}
                    >
                      {title.slice(0, 1)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {title}
                      </span>
                      <span className="block truncate text-sm text-muted-foreground">
                        {description}
                      </span>
                    </span>
                  </div>
                ))}
              </section>
              <div className="overflow-hidden rounded-[0.75rem] border border-border bg-surface py-1 shadow-sm">
                {["Set yourself as away", "Pause notifications", "Help", "Profile Settings"].map(
                  (item, index) => (
                    <button
                      className={[
                        "flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
                        index === 1 ? "bg-muted" : "",
                      ].join(" ")}
                      key={item}
                      type="button"
                    >
                      <span className="grid size-5 place-items-center text-muted-foreground">
                        {index === 0 ? "☾" : "○"}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{item}</span>
                      {index === 1 ? <span className="text-muted-foreground">⌁</span> : null}
                    </button>
                  ),
                )}
                <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
                  Accounts
                </div>
                {["Dianne Russell", "AG Studio"].map((item, index) => (
                  <button
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm"
                    key={item}
                    type="button"
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-muted text-xs">
                      {item.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{item}</span>
                    {index === 0 ? <span className="text-primary">✓</span> : null}
                  </button>
                ))}
              </div>
              <div className="mt-auto border-t border-border pt-3">
                <button
                  className="flex w-full items-center gap-3 rounded-[0.5rem] px-2 py-2 text-left"
                  type="button"
                >
                  <span className="relative grid size-10 place-items-center rounded-full bg-muted text-sm">
                    DR
                    <span className="absolute bottom-0 right-0 size-2.5 rounded-full border border-background bg-emerald-500" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">Dianne Russell</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      russel@hey.com
                    </span>
                  </span>
                  <span className="text-muted-foreground">⌄</span>
                </button>
              </div>
            </div>
          </aside>
          <div className="min-w-0">
            <header className="flex h-14 items-center justify-between border-b border-border px-4">
              <div>
                <div className="text-sm font-semibold">Dashboard</div>
                <div className="text-xs text-muted-foreground">Live workspace overview</div>
              </div>
              <button
                className="rounded-[0.25rem] bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                type="button"
              >
                New report
              </button>
            </header>
            <main className="grid gap-4 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {["Usage", "Members", "Revenue"].map((item) => (
                  <div className="rounded-[0.5rem] border border-border bg-surface p-4" key={item}>
                    <div className="text-sm font-medium">{item}</div>
                    <div className="mt-1 text-2xl font-semibold tracking-tight">24K</div>
                  </div>
                ))}
              </div>
              <div className="rounded-[0.5rem] border border-border bg-surface p-4">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="mt-3 h-3 w-2/3 rounded bg-muted" />
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (name === "onboarding-wizard") {
    return <OnboardingWizardInteractivePreview />;
  }

  if (name === "skeleton") {
    return (
      <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="space-y-3 rounded-[0.5rem] border border-border bg-surface p-4">
          <div className="relative isolate h-6 w-2/3 overflow-hidden rounded-[0.25rem] bg-secondary after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          <div className="relative isolate h-4 w-full overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          <div className="relative isolate h-4 w-1/2 overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
        </div>
        <div className="flex items-center gap-3 rounded-[0.5rem] border border-border bg-surface p-4">
          <div className="relative isolate size-10 overflow-hidden rounded-full bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          <div className="space-y-2">
            <div className="relative isolate h-4 w-28 overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
            <div className="relative isolate h-3 w-20 overflow-hidden rounded-[0.25rem] bg-muted after:absolute after:inset-0 after:-translate-x-full after:bg-[linear-gradient(90deg,transparent,oklch(1_0_0/0.38),transparent)] after:content-[''] motion-safe:after:animate-skeleton-shimmer motion-reduce:after:hidden" />
          </div>
        </div>
      </div>
    );
  }

  if (name === "progress") {
    return (
      <div className="grid gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Syncing records</span>
            <span className="text-muted-foreground">64%</span>
          </div>
          <div
            aria-label="Sync progress"
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={64}
            className="relative isolate h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div className="h-full w-full origin-left scale-x-[0.64] rounded-full bg-primary transition-transform duration-[var(--brilliant-duration-normal)]" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Preparing export</div>
          <div
            aria-label="Preparing export"
            className="relative isolate h-1.5 w-full overflow-hidden rounded-full bg-muted"
            role="progressbar"
          >
            <div className="h-full w-1/3 rounded-full bg-primary motion-safe:animate-progress-indeterminate motion-reduce:w-full motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    );
  }

  if (name === "spinner") {
    return (
      <div className="flex items-center gap-5">
        {[
          ["sm", "size-4", "text-muted-foreground"],
          ["md", "size-5", "text-primary"],
          ["lg", "size-6", "text-critical"],
        ].map(([label, size, color]) => (
          <span className="inline-flex items-center gap-2 text-sm" key={label}>
            <span className={["inline-flex items-center justify-center", color].join(" ")}>
              <svg
                aria-hidden="true"
                className={["motion-safe:animate-spinner motion-reduce:animate-none", size].join(
                  " ",
                )}
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-20"
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
            </span>
            <span>{label}</span>
          </span>
        ))}
      </div>
    );
  }

  if (name === "empty-state") {
    return (
      <div className="grid justify-items-center rounded-[0.5rem] border border-border bg-surface p-6 text-center motion-safe:animate-enter motion-reduce:animate-none">
        <div
          aria-hidden="true"
          className="mb-3 grid size-10 place-items-center rounded-full bg-primary/10 text-primary shadow-[inset_0_0_0_0.5px_color-mix(in_oklch,currentColor_20%,transparent)]"
        >
          ⌘
        </div>
        <h3 className="text-base font-semibold tracking-tight">No API keys</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          Create a key to connect this workspace to your automation pipeline.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            className={`${buttonVariants[0][2]} h-8 rounded-[0.375rem] px-3 text-xs font-medium`}
            type="button"
          >
            Create key
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[0.5rem] border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
      Preview pending for this registry item.
    </div>
  );
}

const navIcons: Record<string, ReactNode> = {
  Accordion: <path d="M7 8h10M7 12h10M7 16h10" />,
  "Alert Dialog": <path d="M12 8v4m0 4h.01M4 19h16L12 5 4 19Z" />,
  "Application Shell": <path d="M4 6h16M8 6v14M4 20h16" />,
  "Aspect Ratio": <path d="M4 8V5h3m10 0h3v3M7 19H4v-3m16 0v3h-3" />,
  Avatar: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0" />,
  Badge: <path d="m12 4 2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2L7.8 17l.8-4.7L5.2 9l4.7-.7L12 4Z" />,
  Blocks: <path d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z" />,
  Breadcrumb: <path d="m6 8 4 4-4 4m8-8 4 4-4 4" />,
  Button: <path d="M7 8h10a4 4 0 0 1 0 8H7a4 4 0 0 1 0-8Z" />,
  "Button Group": <path d="M4 8h6v8H4V8Zm6 0h10v8H10V8Z" />,
  CLI: <path d="m5 8 4 4-4 4m7 0h7" />,
  Calendar: <path d="M7 3v4m10-4v4M4 9h16M5 5h14v15H5V5Z" />,
  Card: <path d="M4 6h16v12H4V6Zm3 4h5m-5 4h8" />,
  Carousel: <path d="M8 6h12v12H8V6ZM4 9v6" />,
  Checkbox: <path d="M5 5h14v14H5V5Zm4 7 2 2 4-5" />,
  Collapsible: <path d="M6 9h12M9 5l3 3 3-3M9 19l3-3 3 3" />,
  Combobox: <path d="M5 7h14v10H5V7Zm4 3h6m-6 4h4" />,
  Command: <path d="M8 8H6a2 2 0 1 1 2-2v12a2 2 0 1 1-2-2h12a2 2 0 1 1-2 2V6a2 2 0 1 1 2 2H8Z" />,
  Components: <path d="M4 7h7v7H4V7Zm9 3h7v7h-7v-7Z" />,
  "Context Menu": <path d="M5 6h14M5 12h10M5 18h7" />,
  "Date Input": <path d="M7 3v4m10-4v4M5 5h14v15H5V5Zm4 8h6" />,
  Dialog: <path d="M5 6h14v12H5V6Zm4 4h6m-6 4h4" />,
  Drawer: <path d="M5 5h14v14H5V5Zm3 10h8" />,
  "Dropdown Menu": <path d="M5 7h14v4H5V7Zm2 8h10m-3-2 3 3 3-3" />,
  "Empty State": <path d="M5 7h14v10H5V7Zm4 5h6" />,
  Field: <path d="M5 7h14M5 12h14M5 17h9" />,
  Form: <path d="M7 4h10v16H7V4Zm3 5h4m-4 4h4m-4 4h2" />,
  Foundations: <path d="M12 4 4 8l8 4 8-4-8-4Zm-6 8 6 3 6-3m-12 4 6 3 6-3" />,
  "Getting Started": <path d="M5 12h12m-5-5 5 5-5 5" />,
  "Hover Card": <path d="M5 6h14v10H5V6Zm3 13h8" />,
  Input: <path d="M5 8h14v8H5V8Zm3 4h8" />,
  Label: <path d="M4 7h10l6 5-6 5H4V7Z" />,
  Menubar: <path d="M4 7h16M4 12h16M4 17h16" />,
  "Navigation Menu": <path d="M4 6h16M4 12h12M4 18h8" />,
  "Onboarding Wizard": <path d="M5 5h14v14H5V5Zm4 4h6M9 13h4" />,
  Pagination: <path d="m8 8-4 4 4 4m8-8 4 4-4 4" />,
  Photo: <path d="M5 6h14v12H5V6Zm3 9 3-4 2 3 1.5-2 2.5 3M9 9h.01" />,
  Popover: <path d="M6 5h12v10H9l-3 4V5Z" />,
  Progress: <path d="M5 12h14M5 12h8" />,
  "Radio Group": <path d="M8 8h.01M8 16h.01M12 8h7M12 16h7" />,
  Scrollbar: <path d="M8 4h8v16H8V4Zm5 3h1v6h-1" />,
  "Scroll Area": <path d="M7 4h10v16H7V4Zm7 3h1v7h-1" />,
  Select: <path d="M5 8h14v8H5V8Zm10 3 2 2 2-2" />,
  Separator: <path d="M5 12h14" />,
  Sheet: <path d="M5 5h14v14H5V5Zm10 0v14" />,
  shadcn: <path d="m7 17 10-10M10 20l10-10" />,
  Skeleton: <path d="M5 8h14M5 12h10M5 16h12" />,
  Slider: <path d="M5 12h14m-5 0a2 2 0 1 0 0 .01" />,
  Spinner: <path d="M12 3a9 9 0 1 0 9 9" />,
  Switch: <path d="M8 8h8a4 4 0 0 1 0 8H8a4 4 0 0 1 0-8Zm7 4h.01" />,
  Table: <path d="M4 6h16v12H4V6Zm0 4h16M9 6v12" />,
  Tabs: <path d="M5 6h5v4H5V6Zm7 0h7v4h-7V6ZM5 10h14v8H5v-8Z" />,
  Text: <path d="M5 6h14M9 6v12m-4 0h8" />,
  Textarea: <path d="M5 6h14v12H5V6Zm3 4h8m-8 4h6" />,
  Theming: (
    <path d="M12 3a9 9 0 0 0 0 18h1a2 2 0 0 0 1-3.7 1 1 0 0 1 .6-1.8H16A5 5 0 0 0 16 5a9 9 0 0 0-4-2Z" />
  ),
  Toast: <path d="M6 7h12v9H9l-3 3V7Z" />,
  Tooltip: <path d="M6 6h12v8H9l-3 4V6Z" />,
  "Why Brilliant": <path d="M12 3 4 7v6c0 4 3.4 6.7 8 8 4.6-1.3 8-4 8-8V7l-8-4Z" />,
};

function DocsSearchDialog({
  onClose,
  onSelect,
  open,
}: {
  onClose: () => void;
  onSelect: RouteSelectHandler;
  open: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const searchListId = useId();
  const normalizedQuery = query.trim().toLowerCase();
  const results = docsSearchItems.filter(({ group, href, label }) => {
    if (!normalizedQuery) return true;
    return `${label} ${group} ${href}`.toLowerCase().includes(normalizedQuery);
  });

  useEffect(() => {
    if (!open) return;

    setActiveIndex(0);
    setQuery("");
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  if (!open) return null;

  const selectResult = (href: string) => {
    onClose();
    onSelect(href);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <button
        aria-label="Close documentation search"
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label="Search documentation"
        aria-modal="true"
        className="relative w-full max-w-xl overflow-hidden rounded-[0.625rem] border border-border bg-background shadow-[0_24px_70px_-28px_oklch(0_0_0/0.45)]"
        role="dialog"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <svg
            aria-hidden="true"
            className="size-4 shrink-0 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="6" />
            <path d="m16 16 4 4" />
          </svg>
          <input
            aria-activedescendant={
              results[activeIndex] ? `${searchListId}-result-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            aria-controls={searchListId}
            aria-expanded="true"
            className="h-12 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              }

              if (event.key === "Enter" && results[activeIndex]) {
                event.preventDefault();
                selectResult(results[activeIndex].href);
              }

              if (event.key === "Escape") {
                event.preventDefault();
                onClose();
              }
            }}
            placeholder="Search components, blocks, and guides…"
            ref={inputRef}
            role="combobox"
            value={query}
          />
          <kbd className="rounded-[0.25rem] border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
            esc
          </kbd>
        </div>
        <div
          className="max-h-[min(28rem,60vh)] overflow-y-auto p-2"
          id={searchListId}
          role="listbox"
        >
          {results.length > 0 ? (
            results.map((result, index) => (
              <a
                aria-selected={activeIndex === index}
                className={[
                  "flex items-center gap-3 rounded-[0.375rem] px-3 py-2 text-sm outline-none transition-colors",
                  activeIndex === index
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
                href={result.href}
                id={`${searchListId}-result-${index}`}
                key={`${result.group}-${result.href}`}
                onClick={(event) => {
                  event.preventDefault();
                  selectResult(result.href);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                role="option"
              >
                <NavIcon active={activeIndex === index} label={result.label} />
                <span className="min-w-0 flex-1 truncate font-medium">{result.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{result.group}</span>
              </a>
            ))
          ) : (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No documentation found for “{query}”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DocsSidebarHeader({
  onNavigate,
  onSearchOpen,
}: {
  onNavigate: NavigateHandler | undefined;
  onSearchOpen: () => void;
}) {
  return (
    <div className="mb-5 space-y-3">
      <a className="flex items-center gap-3" href="/" onClick={(event) => onNavigate?.(event, "/")}>
        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-surface text-sm font-semibold tracking-tight text-foreground shadow-sm">
          B
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold tracking-tight text-foreground">
            Brilliant UI
          </span>
          <span className="block truncate text-xs leading-5 text-muted-foreground">
            Component system
          </span>
        </span>
      </a>
      <button
        aria-haspopup="dialog"
        className="flex h-9 w-full items-center gap-2 rounded-[0.5rem] border border-border bg-surface px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        onClick={onSearchOpen}
        type="button"
      >
        <span aria-hidden="true" className="text-base leading-none">
          ⌕
        </span>
        <span className="min-w-0 flex-1 truncate">Search docs</span>
        <kbd className="rounded-[0.25rem] border border-border bg-background px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
          /
        </kbd>
      </button>
    </div>
  );
}

function NavIcon({ active, label }: { active: boolean; label: string }) {
  return (
    <svg
      aria-hidden="true"
      className={[
        "size-4 shrink-0 transition-colors",
        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
      ].join(" ")}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.85"
      viewBox="0 0 24 24"
    >
      {navIcons[label] ?? <path d="M5 12h14" />}
    </svg>
  );
}

function DocsNavGroup({
  activeRoute,
  group,
  onNavigate,
}: {
  activeRoute: NavHref;
  group: NavGroup;
  onNavigate: NavigateHandler | undefined;
}) {
  return (
    <section className="pb-4 last:pb-0">
      <h2 className="mb-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {group.label}
      </h2>
      <ul className="space-y-0.5">
        {group.items.map(([label, href]) => (
          <li key={href}>
            <a
              aria-current={isRouteActive(activeRoute, href) ? "page" : undefined}
              className={[
                "group flex h-8 items-center gap-3 rounded-[0.5rem] px-2.5 text-sm leading-5 transition-colors",
                isRouteActive(activeRoute, href)
                  ? "bg-primary/8 font-medium text-foreground shadow-[inset_0_0_0_0.5px_oklch(0.707_0.165_254.624/0.12)]"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
              href={href}
              onClick={(event) => onNavigate?.(event, href)}
            >
              <NavIcon active={isRouteActive(activeRoute, href)} label={label} />
              <span className="min-w-0 truncate">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocsNav({
  activeRoute,
  onNavigate,
  onSearchOpen,
}: {
  activeRoute: NavHref;
  onNavigate?: NavigateHandler;
  onSearchOpen: () => void;
}) {
  return (
    <nav aria-label="Documentation" className="text-sm">
      <DocsSidebarHeader onNavigate={onNavigate} onSearchOpen={onSearchOpen} />
      <div>
        {navGroups.map((group) => (
          <DocsNavGroup
            activeRoute={activeRoute}
            group={group}
            key={group.label}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

function isTopNavActive(activeRoute: NavHref, topHref: (typeof topNavItems)[number][1]) {
  const pathname = routePathname(activeRoute);

  if (topHref === "/") {
    return pathname === "/";
  }

  if (topHref === "/components") {
    return pathname === "/components" || pathname.startsWith("/components/");
  }

  return pathname === topHref;
}

function AppHeader({
  activeRoute,
  onMenuClick,
  onNavigate,
}: {
  activeRoute: NavHref;
  onMenuClick: () => void;
  onNavigate: NavigateHandler;
}) {
  return (
    <Header behavior="elevate" position="sticky" scrollThreshold={24}>
      <HeaderContainer>
        <button
          aria-controls="mobile-docs-nav"
          aria-label="Open documentation navigation"
          className="inline-flex size-9 items-center justify-center rounded-[0.25rem] text-foreground transition-[background-color,transform] hover:bg-muted active:scale-[0.97] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring motion-reduce:transition-none md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ☰
          </span>
        </button>
        <HeaderBrand href="/" onClick={(event) => onNavigate(event, "/")}>
          Brilliant UI
        </HeaderBrand>
        <HeaderNav className="!hidden min-w-0 flex-1 overflow-x-auto md:!flex">
          {topNavItems.map(([label, href]) => (
            <HeaderLink
              active={isTopNavActive(activeRoute, href)}
              className="shrink-0 whitespace-nowrap"
              href={href}
              key={href}
              onClick={(event) => onNavigate(event, href)}
            >
              {label}
            </HeaderLink>
          ))}
        </HeaderNav>
        <HeaderActions className="shrink-0">
          <Badge tone="ready">v0.1 foundation</Badge>
        </HeaderActions>
      </HeaderContainer>
    </Header>
  );
}

function MobileDocsNav({
  activeRoute,
  onClose,
  onNavigate,
  onSearchOpen,
  open,
}: {
  activeRoute: NavHref;
  onClose: () => void;
  onNavigate: NavigateHandler;
  onSearchOpen: () => void;
  open: boolean;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden" id="mobile-docs-nav">
      <button
        aria-label="Close documentation navigation"
        className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-modal="true"
        aria-label="Documentation navigation"
        className="relative h-full w-[min(21rem,calc(100vw-2rem))] overflow-y-auto border-r border-border bg-background px-5 py-5 shadow-[12px_0_40px_-28px_oklch(0_0_0/0.45)] motion-safe:animate-enter motion-reduce:animate-none"
        role="dialog"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <a
            className="text-sm font-semibold tracking-tight"
            href="/"
            onClick={(event) => onNavigate(event, "/")}
          >
            Brilliant UI
          </a>
          <button
            aria-label="Close documentation navigation"
            className="inline-flex size-8 items-center justify-center rounded-[0.25rem] border border-border bg-surface text-sm hover:bg-muted"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        <DocsNav activeRoute={activeRoute} onNavigate={onNavigate} onSearchOpen={onSearchOpen} />
      </aside>
    </div>
  );
}

function StatusRail({ firstItemTitle }: { firstItemTitle: string }) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] border-l border-border px-6 py-6 xl:block">
      <div className="space-y-5 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Status
          </p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Complete</dt>
              <dd className="font-medium">41</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Remaining</dt>
              <dd className="font-medium">209</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Registry items</dt>
              <dd className="font-medium">{registry.length}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Micro UX</dt>
              <dd className="font-medium">built in</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-lg border border-border bg-surface p-4">
          <p className="font-medium">Current component</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {firstItemTitle} is available from the local registry.
          </p>
        </div>
      </div>
    </aside>
  );
}

function AppFooter({ onNavigate }: { onNavigate: NavigateHandler }) {
  return (
    <Footer variant="muted">
      <FooterContainer className="py-8 md:py-8">
        <FooterMain>
          <div>
            <FooterBrand href="/" onClick={(event) => onNavigate(event, "/")}>
              Brilliant UI
            </FooterBrand>
            <FooterDescription>
              Copy-owned shadcn-compatible source, enterprise-grade tokens, and built-in micro UX.
            </FooterDescription>
          </div>
          <FooterNav>
            <FooterGroup title="Build">
              <FooterLink href="/components" onClick={(event) => onNavigate(event, "/components")}>
                Components
              </FooterLink>
              <FooterLink href="/blocks" onClick={(event) => onNavigate(event, "/blocks")}>
                Blocks
              </FooterLink>
            </FooterGroup>
            <FooterGroup title="Customize">
              <FooterLink
                href="/foundations"
                onClick={(event) => onNavigate(event, "/foundations")}
              >
                Foundations
              </FooterLink>
              <FooterLink href="/theming" onClick={(event) => onNavigate(event, "/theming")}>
                Theming
              </FooterLink>
            </FooterGroup>
            <FooterGroup title="Resources">
              <FooterLink href="/" onClick={(event) => onNavigate(event, "/")}>
                Documentation
              </FooterLink>
              <FooterLink href="/cli" onClick={(event) => onNavigate(event, "/cli")}>
                CLI
              </FooterLink>
            </FooterGroup>
          </FooterNav>
        </FooterMain>
        <FooterBottom className="mt-8">
          <span>© 2026 Brilliant UI</span>
          <span>App-owned components. Brandable by design.</span>
        </FooterBottom>
      </FooterContainer>
    </Footer>
  );
}

function App() {
  const firstItem = registry[0];
  const [activeRoute, setActiveRoute] = useState<NavHref>(() => getRoute());
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = routePathname(activeRoute);
  const componentName = pathname.startsWith("/components/")
    ? pathname.replace("/components/", "")
    : null;
  const selectedItem = componentName ? registry.find((item) => item.name === componentName) : null;
  const showHome = pathname === "/";
  const showComponentsIndex = pathname === "/components";
  const showButton = pathname === "/components/button";
  const showComponentPage = Boolean(selectedItem && selectedItem.name !== "button");
  const showFoundations = pathname === "/foundations";
  const showBlocks = pathname === "/blocks";
  const showTheming = pathname === "/theming";
  const showCli = pathname === "/cli";
  const routeFound =
    showHome ||
    showComponentsIndex ||
    showButton ||
    showComponentPage ||
    showFoundations ||
    showBlocks ||
    showTheming ||
    showCli;

  useEffect(() => {
    const syncRoute = () => {
      setActiveRoute(getRoute());
    };

    window.addEventListener("popstate", syncRoute);

    return () => {
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  const selectRoute: RouteSelectHandler = (href) => {
    window.history.pushState(null, "", href);
    setActiveRoute(getRoute());
    setMobileNavOpen(false);
    setSearchOpen(false);

    window.requestAnimationFrame(() => {
      const hash = routeHash(href);
      const target = hash ? document.getElementById(hash.slice(1)) : null;

      if (target) {
        target.scrollIntoView({ block: "start" });
        return;
      }

      window.scrollTo({ top: 0 });
    });
  };

  const navigate: NavigateHandler = (event, href) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    selectRoute(href);
  };

  const openSearch = () => {
    setMobileNavOpen(false);
    setSearchOpen(true);
  };

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const targetIsEditable =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT";

      if (event.key === "/" && !targetIsEditable) {
        event.preventDefault();
        openSearch();
      }

      if (event.key === "Escape" && searchOpen) {
        event.preventDefault();
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleSearchShortcut);
    return () => document.removeEventListener("keydown", handleSearchShortcut);
  }, [searchOpen]);

  useEffect(() => {
    if (!mobileNavOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[0.25rem] focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        href="#content"
      >
        Skip to content
      </a>
      <AppHeader
        activeRoute={activeRoute}
        onMenuClick={() => setMobileNavOpen(true)}
        onNavigate={navigate}
      />
      <MobileDocsNav
        activeRoute={activeRoute}
        onClose={() => setMobileNavOpen(false)}
        onNavigate={navigate}
        onSearchOpen={openSearch}
        open={mobileNavOpen}
      />
      <DocsSearchDialog
        onClose={() => setSearchOpen(false)}
        onSelect={selectRoute}
        open={searchOpen}
      />

      <main className="mx-auto grid max-w-screen-2xl md:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border px-6 py-6 md:block">
          <DocsNav activeRoute={activeRoute} onNavigate={navigate} onSearchOpen={openSearch} />
        </aside>

        <div
          className="min-w-0 max-w-full overflow-hidden px-4 py-10 md:px-8 lg:px-10"
          id="content"
        >
          {showHome ? (
            <>
              <section className="mx-auto max-w-4xl pb-14" id="getting-started">
                <Badge tone="ready">shadcn-compatible enterprise UI</Badge>
                <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
                  shadcn-compatible components with premium micro UX built in.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  Brilliant UI keeps the copy-owned shadcn workflow, then adds brandable tokens,
                  enterprise-grade defaults, restrained animation primitives, and product-ready
                  blocks for SaaS, internal tools, and AI apps.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    className="inline-flex h-9 items-center rounded-[0.25rem] bg-primary px-4 text-sm font-medium text-primary-foreground"
                    href="/cli"
                    onClick={(event) => navigate(event, "/cli")}
                  >
                    Get started
                  </a>
                  <a
                    className="inline-flex h-9 items-center rounded-[0.25rem] border border-border px-4 text-sm font-medium"
                    href="/components"
                    onClick={(event) => navigate(event, "/components")}
                  >
                    Browse components
                  </a>
                </div>
                <div className="mt-8">
                  <MiniTerminal>{`npx brilliant-ui init
npx brilliant-ui add button dialog dropdown-menu`}</MiniTerminal>
                </div>
              </section>

              <section className="mx-auto max-w-4xl space-y-6 pb-14">
                <SectionHeading
                  description="The reason to use Brilliant instead of plain generated components."
                  id="why-brilliant"
                >
                  Why Brilliant
                </SectionHeading>
                <div className="grid gap-4 sm:grid-cols-2">
                  {differentiators.map(([title, description]) => (
                    <article className="rounded-lg border border-border bg-surface p-5" key={title}>
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="mx-auto max-w-4xl space-y-6 pb-14">
                <SectionHeading
                  description="Brilliant UI is the front door for shadcn-compatible source components."
                  id="shadcn"
                >
                  Built on the shadcn model
                </SectionHeading>
                <div className="rounded-lg border border-border bg-surface">
                  <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                    {shadcnFlow.map(([title, command]) => (
                      <div className="p-5" key={title}>
                        <p className="font-semibold">{title}</p>
                        <p className="mt-2 font-mono text-xs text-muted-foreground">{command}</p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-border p-5">
                    <p className="text-sm leading-6 text-muted-foreground">
                      The generated files follow shadcn conventions: Radix where appropriate,
                      Tailwind semantic classes, editable source, components aliases, and app-owned
                      code. The Brilliant layer adds tokens, micro UX, enterprise styling, metadata,
                      and product composition rules.
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {showComponentsIndex ? (
            <section className="mx-auto max-w-4xl space-y-6 pb-14">
              <SectionHeading
                description="Implemented registry items that can be installed into an app today."
                id="components"
              >
                Components
              </SectionHeading>

              <CodeBlock language="bash">{`npx brilliant-ui add ${registry.map((item) => item.name).join(" ")}`}</CodeBlock>

              <div className="overflow-auto rounded-lg border border-border">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-muted text-left">
                    <tr>
                      <th className="border-b border-border px-4 py-3 font-medium">Component</th>
                      <th className="border-b border-border px-4 py-3 font-medium">Purpose</th>
                      <th className="border-b border-border px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registry.map((item) => (
                      <tr className="border-b border-border last:border-b-0" key={item.name}>
                        <td className="whitespace-nowrap px-4 py-3">
                          <a
                            className="font-medium text-primary hover:underline"
                            href={`/components/${item.name}`}
                            onClick={(event) => navigate(event, `/components/${item.name}`)}
                          >
                            {item.title}
                          </a>
                        </td>
                        <td className="min-w-80 px-4 py-3 text-muted-foreground">
                          {item.metadata.purpose}
                        </td>
                        <td className="px-4 py-3">
                          <Badge tone="ready">available</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {showButton ? (
            <section className="mx-auto max-w-4xl space-y-8 pb-14">
              <div className="scroll-mt-24" id="button">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-semibold tracking-tight">Button</h2>
                  <Badge tone="ready">available</Badge>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Displays a button or a component that looks like a button. Use it for actions
                  inside forms, dialogs, toolbars, and application screens. Motion, focus, disabled,
                  and reduced-motion behavior are part of the generated source.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Installation</h3>
                <CodeBlock language="bash">{`npx brilliant-ui add button`}</CodeBlock>
              </div>

              <ExamplePanel code={usageForComponent("button")}>
                <PreviewButton className={`${buttonVariants[0][2]} h-9 px-3.5 text-sm`}>
                  Save changes
                </PreviewButton>
              </ExamplePanel>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Variants</h3>
                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="flex flex-wrap gap-3">
                    {buttonVariants.map(([label, text, className]) => (
                      <PreviewButton className={`h-9 px-3.5 text-sm ${className}`} key={label}>
                        {text}
                      </PreviewButton>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Sizes</h3>
                <div className="rounded-lg border border-border bg-background p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {buttonSizes.map(([label, className]) => (
                      <PreviewButton className={`${buttonVariants[0][2]} ${className}`} key={label}>
                        {label === "Icon" ? "I" : label}
                      </PreviewButton>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Props</h3>
                <div className="overflow-auto rounded-lg border border-border">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-muted text-left">
                      <tr>
                        <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                        <th className="border-b border-border px-4 py-3 font-medium">Type</th>
                        <th className="border-b border-border px-4 py-3 font-medium">Default</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buttonProps.map(([name, type, defaultValue]) => (
                        <tr className="border-b border-border last:border-b-0" key={name}>
                          <td className="px-4 py-3 font-mono text-xs">{name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {type}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                            {defaultValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Accessibility</h3>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                  <li>Uses the native button element by default.</li>
                  <li>
                    Defaults to <code>type="button"</code> to avoid accidental form submission.
                  </li>
                  <li>Icon-only buttons must include an accessible label.</li>
                  <li>Keyboard focus is visible through the shared Brilliant focus ring.</li>
                  <li>Micro animations are disabled through reduced-motion media preferences.</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Micro UX contract</h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Hover", "Raised buttons lift by 1px and increase elevation."],
                    ["Press", "Actions compress to 99% scale for tactile feedback."],
                    ["Reduce", "Motion is wrapped in motion-safe / motion-reduce classes."],
                  ].map(([title, description]) => (
                    <article className="rounded-lg border border-border bg-surface p-4" key={title}>
                      <p className="font-medium">{title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                    </article>
                  ))}
                </div>
              </div>

              <details className="rounded-lg border border-border bg-surface">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  Registry metadata
                </summary>
                <div className="border-t border-border p-4">
                  <div className="flex flex-wrap gap-2">
                    {firstItem?.metadata.slots.map((slot) => (
                      <Badge key={slot}>{slot}</Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Registry metadata is used by the CLI and AI composition tooling. It is shown
                    here as supporting information, not as the component documentation itself.
                  </p>
                </div>
              </details>
            </section>
          ) : null}

          {showComponentPage && selectedItem
            ? (() => {
                const item = selectedItem;
                const usage = usageForComponent(item.name);

                return (
                  <section className="mx-auto max-w-4xl space-y-6 pb-14" key={item.name}>
                    <div className="scroll-mt-24 border-b border-border pb-4" id={item.name}>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-semibold tracking-tight">{item.title}</h2>
                        <Badge tone="ready">available</Badge>
                      </div>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Installation</h3>
                      <CodeBlock language="bash">{`npx brilliant-ui add ${item.name}`}</CodeBlock>
                    </div>

                    <ExamplePanel code={usage}>
                      <ComponentMiniPreview name={item.name} />
                    </ExamplePanel>

                    {item.name === "photo" ? (
                      <div className="grid gap-8">
                        {(
                          [
                            [
                              "variants",
                              "Visual variants",
                              "Use the surface treatment that matches the surrounding hierarchy.",
                            ],
                            [
                              "crops",
                              "Crop shapes",
                              "Use rectangle for flexible media and square or circle for fixed 1:1 crops.",
                            ],
                            [
                              "filters",
                              "Filters and tints",
                              "Apply repeatable image treatments or layer a custom color using blend modes.",
                            ],
                            [
                              "ratios",
                              "Aspect ratios and captions",
                              "Reserve the final media geometry before the image loads.",
                            ],
                            [
                              "fit-and-fallback",
                              "Fit modes and fallback",
                              "Control cropping and provide a useful state when media cannot load.",
                            ],
                          ] as const
                        ).map(([example, title, description]) => (
                          <div className="space-y-3" key={example}>
                            <div>
                              <h3 className="text-lg font-semibold">{title}</h3>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {description}
                              </p>
                            </div>
                            <ExamplePanel code={photoExampleCode[example]}>
                              <PhotoExamplePreview example={example} />
                            </ExamplePanel>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {item.name === "header" ||
                    item.name === "footer" ||
                    item.name === "card" ||
                    item.name === "text" ||
                    item.name === "checkbox" ||
                    item.name === "radio-group" ||
                    item.name === "photo" ||
                    item.name === "photo-upload" ||
                    item.name === "separator" ||
                    item.name === "skeleton" ||
                    item.name === "progress" ||
                    item.name === "spinner" ||
                    item.name === "empty-state" ? (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">
                          {item.name === "header" ? "Positioning and scroll behavior" : "Variants"}
                        </h3>
                        <div className="overflow-auto rounded-lg border border-border">
                          <table className="w-full border-collapse text-sm">
                            <thead className="bg-muted text-left">
                              <tr>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Variant
                                </th>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Use
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(item.name === "header"
                                ? [
                                    [
                                      'position="sticky"',
                                      "Stays at the viewport top while content scrolls.",
                                    ],
                                    [
                                      'position="static"',
                                      "Remains in normal document flow and scrolls away.",
                                    ],
                                    [
                                      'position="fixed"',
                                      "Pins to the viewport and overlays page content.",
                                    ],
                                    [
                                      'behavior="elevate"',
                                      "Remains visible and gains subtle separation after the threshold.",
                                    ],
                                    [
                                      'behavior="reveal"',
                                      "Hides while scrolling down and returns while scrolling up.",
                                    ],
                                    [
                                      'behavior="none"',
                                      "Exposes scroll state without applying built-in presentation.",
                                    ],
                                  ]
                                : item.name === "footer"
                                  ? [
                                      ["surface", "Default footer on the page background."],
                                      ["muted", "Stronger separation from the page body."],
                                      ["transparent", "Footer inside an existing surface."],
                                    ]
                                  : item.name === "card"
                                    ? [
                                        ["surface", "Default content grouping."],
                                        ["elevated", "Raised dashboard or summary surfaces."],
                                        [
                                          "accent",
                                          "Selected, highlighted, or recommended content.",
                                        ],
                                        [
                                          "beam",
                                          "Premium live, AI, processing, or highlighted states.",
                                        ],
                                        ["muted", "Low-emphasis grouping inside denser layouts."],
                                        ["ghost", "Structure without a visible panel."],
                                      ]
                                    : item.name === "checkbox"
                                      ? [
                                          ["default", "Normal selection state."],
                                          [
                                            "critical",
                                            "Destructive or high-risk selection context.",
                                          ],
                                        ]
                                      : item.name === "radio-group"
                                        ? [
                                            ["default", "Normal single-choice selection."],
                                            [
                                              "critical",
                                              "High-risk or destructive choice context.",
                                            ],
                                          ]
                                        : item.name === "photo"
                                          ? [
                                              [
                                                "surface",
                                                "Default image surface for cards and grids.",
                                              ],
                                              [
                                                "elevated",
                                                "Prominent gallery, profile, or hero media.",
                                              ],
                                              ["ghost", "Flush media inside an existing surface."],
                                            ]
                                          : item.name === "photo-upload"
                                            ? [
                                                [
                                                  'crop="rectangle"',
                                                  "Flexible content, product, and cover images.",
                                                ],
                                                [
                                                  'crop="square"',
                                                  "Workspace, product, and catalog imagery.",
                                                ],
                                                [
                                                  'crop="circle"',
                                                  "Avatars, profile photos, and round marks.",
                                                ],
                                              ]
                                            : item.name === "separator"
                                              ? [
                                                  [
                                                    "default",
                                                    "Standard divider using the border token.",
                                                  ],
                                                  [
                                                    "muted",
                                                    "Subtle divider for dense grouped content.",
                                                  ],
                                                  ["primary", "Branded or active section divider."],
                                                ]
                                              : item.name === "progress"
                                                ? [
                                                    ["default", "Normal progress indication."],
                                                    [
                                                      "critical",
                                                      "Risky, blocking, or destructive flows.",
                                                    ],
                                                  ]
                                                : item.name === "spinner"
                                                  ? [
                                                      [
                                                        "default",
                                                        "Primary local loading indicator.",
                                                      ],
                                                      ["muted", "Secondary loading next to text."],
                                                      [
                                                        "critical",
                                                        "Loading tied to risky/error recovery.",
                                                      ],
                                                    ]
                                                  : item.name === "empty-state"
                                                    ? [
                                                        ["surface", "Default empty region panel."],
                                                        ["muted", "Lower-emphasis empty region."],
                                                        [
                                                          "ghost",
                                                          "Use inside an already bordered surface.",
                                                        ],
                                                      ]
                                                    : item.name === "skeleton"
                                                      ? [
                                                          [
                                                            "surface",
                                                            "Default loading placeholder.",
                                                          ],
                                                          [
                                                            "raised",
                                                            "Slightly stronger placeholder hierarchy.",
                                                          ],
                                                          [
                                                            "primary",
                                                            "Branded loading placeholder, used sparingly.",
                                                          ],
                                                        ]
                                                      : [
                                                          ["default", "Normal UI copy."],
                                                          [
                                                            "muted",
                                                            "Secondary or supporting copy.",
                                                          ],
                                                          [
                                                            "glow",
                                                            "Premium, active, or AI-ready emphasis.",
                                                          ],
                                                          [
                                                            "shimmer",
                                                            "Generating, syncing, or live processing text.",
                                                          ],
                                                        ]
                              ).map(([variant, use]) => (
                                <tr
                                  className="border-b border-border last:border-b-0"
                                  key={variant}
                                >
                                  <td className="px-4 py-3 font-mono text-xs">{variant}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{use}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {item.name === "header" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            <code>position=&quot;sticky&quot;</code> is the default. Use{" "}
                            <code>position=&quot;static&quot;</code> for a non-sticky header. Fixed
                            headers overlay content, so the application must reserve matching top
                            space. Style <code>data-scrolled</code>,{" "}
                            <code>data-scroll-direction</code>, and <code>data-visibility</code> to
                            change colors, transparency, borders, or density. Use{" "}
                            <code>onScrollStateChange</code> when scroll state needs to swap
                            rendered content such as a logo or action. For a fully custom color
                            treatment, set <code>behavior=&quot;none&quot;</code> and style{" "}
                            <code>data-[scrolled=true]:bg-primary</code> plus{" "}
                            <code>data-[scrolled=true]:text-primary-foreground</code>. Mobile
                            navigation, Escape handling, reduced-motion behavior, and the animated
                            menu icon are built in.
                          </p>
                        ) : item.name === "footer" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Set <code>variant=&quot;surface&quot;</code>,{" "}
                            <code>variant=&quot;muted&quot;</code>, or{" "}
                            <code>variant=&quot;transparent&quot;</code>. Compose link columns with{" "}
                            <code>FooterNav</code> and <code>FooterGroup</code>; reserve{" "}
                            <code>FooterBottom</code> for copyright and legal links.
                          </p>
                        ) : item.name === "card" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Set <code>interactive</code> to add hover lift, elevation, and press
                            feedback for clickable card targets. Set{" "}
                            <code>beam=&#123;state&#125;</code> when a card should enter the premium
                            live/processing state from app state.
                          </p>
                        ) : item.name === "checkbox" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>variant=&quot;critical&quot;</code> only when selecting the
                            option has destructive or high-risk meaning.
                          </p>
                        ) : item.name === "radio-group" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>variant=&quot;critical&quot;</code> on an individual{" "}
                            <code>RadioItem</code> only when the choice itself carries risk. Items
                            in the same group should share the same <code>name</code>.
                          </p>
                        ) : item.name === "photo" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>crop=&quot;square&quot;</code> or{" "}
                            <code>crop=&quot;circle&quot;</code>
                            for fixed 1:1 crops. Use <code>ratio</code> for rectangles,{" "}
                            <code>radius</code> to match the surrounding surface, and{" "}
                            <code>fit=&quot;contain&quot;</code> when cropping would hide meaningful
                            detail. Use <code>filter</code> for presets and <code>PhotoTint</code>{" "}
                            for custom color treatment.
                          </p>
                        ) : item.name === "separator" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>variant=&quot;default&quot;</code>,{" "}
                            <code>variant=&quot;muted&quot;</code>, or{" "}
                            <code>variant=&quot;primary&quot;</code>. The separator is decorative by
                            default; set <code>decorative=&#123;false&#125;</code> when it carries
                            semantic structure.
                          </p>
                        ) : item.name === "skeleton" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>variant=&quot;surface&quot;</code> for most placeholders. Keep
                            skeletons close to the shape of the incoming content.
                          </p>
                        ) : item.name === "progress" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>indeterminate</code> when real progress is unknown. Use{" "}
                            <code>value</code> and <code>max</code> only for measured progress.
                          </p>
                        ) : item.name === "spinner" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>label</code> to describe the loading operation for screen
                            reader users. Prefer <code>variant=&quot;muted&quot;</code> beside
                            visible copy.
                          </p>
                        ) : item.name === "empty-state" ? (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>variant=&quot;ghost&quot;</code> when the parent already has a
                            visible panel. Keep actions concrete and limited.
                          </p>
                        ) : (
                          <p className="text-sm leading-6 text-muted-foreground">
                            Use <code>variant=&quot;shimmer&quot;</code> for short live/processing
                            text. Override the highlight with{" "}
                            <code>shimmerColor=&quot;white&quot;</code> or set{" "}
                            <code>--brilliant-text-shimmer-highlight</code> globally. The animation
                            is disabled for reduced-motion users.
                          </p>
                        )}
                      </div>
                    ) : null}

                    {item.name === "skeleton" ? (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Sizes</h3>
                        <div className="overflow-auto rounded-lg border border-border">
                          <table className="w-full border-collapse text-sm">
                            <thead className="bg-muted text-left">
                              <tr>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Prop
                                </th>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Use
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                ["text", "Single body text line."],
                                ["title", "Heading or title line."],
                                ["avatar", "User or object avatar."],
                                ["thumbnail", "Media or preview panel."],
                                ["card", "Large surface placeholder."],
                              ].map(([size, use]) => (
                                <tr className="border-b border-border last:border-b-0" key={size}>
                                  <td className="px-4 py-3 font-mono text-xs">{`size="${size}"`}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{use}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          Set <code>shimmer=&#123;false&#125;</code> to use a calmer pulse animation
                          instead of the default shimmer.
                        </p>
                      </div>
                    ) : null}

                    {item.name === "checkbox" ||
                    item.name === "avatar" ||
                    item.name === "radio-group" ||
                    item.name === "progress" ||
                    item.name === "spinner" ||
                    item.name === "empty-state" ? (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Sizes</h3>
                        <div className="overflow-auto rounded-lg border border-border">
                          <table className="w-full border-collapse text-sm">
                            <thead className="bg-muted text-left">
                              <tr>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Prop
                                </th>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Use
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(item.name === "avatar"
                                ? [
                                    ["sm", "Dense tables, comments, and compact member lists."],
                                    ["md", "Default identity display."],
                                    ["lg", "Profile rows and detail panels."],
                                    ["xl", "Prominent profile headers."],
                                  ]
                                : item.name === "radio-group"
                                  ? [
                                      ["sm", "Dense settings panels and compact filters."],
                                      ["md", "Default form rows and preference groups."],
                                      ["lg", "Prominent plan, permission, or approval choices."],
                                    ]
                                  : item.name === "progress"
                                    ? [
                                        ["sm", "Subtle inline or table-level progress."],
                                        ["md", "Default task progress."],
                                        ["lg", "Prominent page or modal progress."],
                                      ]
                                    : item.name === "spinner"
                                      ? [
                                          ["sm", "Inline button and table-cell loading."],
                                          ["md", "Default compact loading status."],
                                          ["lg", "Prominent empty-state or page-region loading."],
                                        ]
                                      : item.name === "empty-state"
                                        ? [
                                            ["sm", "Compact empty rows and side panels."],
                                            ["md", "Default empty region."],
                                            ["lg", "Primary page or modal empty state."],
                                          ]
                                        : [
                                            ["sm", "Dense tables and compact filter menus."],
                                            ["md", "Default form rows and settings lists."],
                                            [
                                              "lg",
                                              "Prominent settings rows, approvals, and touch-friendly UI.",
                                            ],
                                          ]
                              ).map(([size, use]) => (
                                <tr className="border-b border-border last:border-b-0" key={size}>
                                  <td className="px-4 py-3 font-mono text-xs">{`size="${size}"`}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{use}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    {item.name === "text" ? (
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Sizes</h3>
                        <div className="overflow-auto rounded-lg border border-border">
                          <table className="w-full border-collapse text-sm">
                            <thead className="bg-muted text-left">
                              <tr>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Prop
                                </th>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Use
                                </th>
                                <th className="border-b border-border px-4 py-3 font-medium">
                                  Example
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                [
                                  "sm",
                                  "Supporting labels, timestamps, helper copy.",
                                  "Updated 2 minutes ago",
                                ],
                                [
                                  "md",
                                  "Default body copy and ordinary interface text.",
                                  "Workspace usage",
                                ],
                                [
                                  "lg",
                                  "Emphasis text inside cards, panels, and empty states.",
                                  "AI ready",
                                ],
                                [
                                  "xl",
                                  "Short premium callouts and compact headings.",
                                  "Generating insights",
                                ],
                              ].map(([size, use, example]) => (
                                <tr className="border-b border-border last:border-b-0" key={size}>
                                  <td className="px-4 py-3 font-mono text-xs">{`size="${size}"`}</td>
                                  <td className="px-4 py-3 text-muted-foreground">{use}</td>
                                  <td className="px-4 py-3">
                                    <span
                                      className={[
                                        "font-medium tracking-[-0.01em]",
                                        size === "sm" ? "text-sm leading-5" : "",
                                        size === "md" ? "text-base leading-6" : "",
                                        size === "lg" ? "text-lg leading-7" : "",
                                        size === "xl" ? "text-2xl leading-8 tracking-tight" : "",
                                      ].join(" ")}
                                    >
                                      {example}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                          Use <code>size=&quot;sm&quot;</code>, <code>size=&quot;md&quot;</code>,{" "}
                          <code>size=&quot;lg&quot;</code>, or <code>size=&quot;xl&quot;</code>{" "}
                          alongside any text variant.
                        </p>
                      </div>
                    ) : null}

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Anatomy</h3>
                        <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-surface p-4">
                          {item.metadata.slots.map((slot) => (
                            <Badge key={slot}>{slot}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold">Micro UX</h3>
                        <div className="rounded-lg border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground">
                          {item.name === "card"
                            ? "Interactive cards lift by 1px, increase elevation, soften the border toward primary, and compress to 99.5% on press. The beam variant adds a rotating conic border animation and disables it for reduced-motion users."
                            : item.name === "text"
                              ? "Glow adds a token-colored premium aura. Shimmer animates a tokenized gradient across the glyphs and falls back to static text for reduced-motion users."
                              : item.name === "photo"
                                ? "Photo reserves layout space with ratio, fades loaded images in from a subtle blur, and smoothly transitions filter and tint changes. Fallback and caption layers remain semantic, and motion is disabled for reduced-motion users."
                                : item.name === "switch"
                                  ? "The thumb uses a spring-timed snap, stretches slightly on press, and the active track gains a subtle inset highlight. Motion is disabled for reduced-motion users."
                                  : "Uses Brilliant tokens for focus, density, radius, and motion. Motion-bearing states are guarded with reduced-motion behavior in the generated source."}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Accessibility</h3>
                      <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                        {item.metadata.accessibility.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </section>
                );
              })()
            : null}

          {showFoundations ? (
            <section className="mx-auto max-w-4xl space-y-6 pb-14">
              <SectionHeading
                description="The shared system layer underneath components and blocks."
                id="foundations"
              >
                Foundations
              </SectionHeading>
              <div className="grid gap-4 sm:grid-cols-2">
                {foundations.map(([title, description]) => (
                  <article className="rounded-lg border border-border bg-surface p-5" key={title}>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {showBlocks ? (
            <section className="mx-auto max-w-4xl space-y-6 pb-14">
              <SectionHeading
                description="Real product sections composed from Brilliant primitives. These are the things teams paste into SaaS apps, admin portals, and onboarding flows."
                id="blocks"
              >
                Blocks
              </SectionHeading>

              <div className="grid gap-8">
                {productBlockExamples.map((block) => (
                  <article className="space-y-3" key={block.id}>
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <div className="mb-2">
                          <Badge>{block.category}</Badge>
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">{block.title}</h3>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                          {block.description}
                        </p>
                      </div>
                    </div>
                    <ExamplePanel code={block.code}>
                      <ProductBlockPreview id={block.id} />
                    </ExamplePanel>
                  </article>
                ))}
              </div>

              <details className="rounded-lg border border-border bg-surface">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium">
                  Planned block families
                </summary>
                <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2">
                  {blockGroups.map(([title, description]) => (
                    <article
                      className="rounded-lg border border-border bg-background p-4"
                      key={title}
                    >
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                    </article>
                  ))}
                </div>
              </details>
            </section>
          ) : null}

          {showTheming ? (
            <section className="mx-auto max-w-4xl space-y-6 pb-14">
              <SectionHeading
                description="The default indigo is only a starting point; production apps can own their brand."
                id="theming"
              >
                Brand theming
              </SectionHeading>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                <CodeBlock language="css">{`:root {
  --brilliant-primary: oklch(0.54 0.23 276);
  --brilliant-primary-foreground: oklch(1 0 0);
  --brilliant-ring: oklch(0.61 0.22 276);
}

[data-brand="acme"] {
  --brilliant-primary: oklch(0.62 0.18 145);
  --brilliant-ring: oklch(0.62 0.18 145);
}`}</CodeBlock>
                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="font-semibold">What changes?</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Buttons, focus rings, badges, charts, blocks, and future components inherit
                    semantic tokens instead of hardcoded colors.
                  </p>
                </div>
              </div>
            </section>
          ) : null}

          {showCli ? (
            <section className="mx-auto max-w-4xl space-y-6 pb-20">
              <SectionHeading
                description="Initialize existing projects, map shadcn aliases, preview changes, and install copy-owned source."
                id="cli"
              >
                CLI
              </SectionHeading>
              <div className="rounded-lg border border-border bg-surface">
                <div className="border-b border-border px-4 py-3 text-sm font-medium">Demo</div>
                <div className="p-4">
                  <CodeBlock language="bash">{`TMP_DEMO=$(mktemp -d)
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- init --cwd "$TMP_DEMO"
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- add button --cwd "$TMP_DEMO"
find "$TMP_DEMO" -maxdepth 4 -type f | sort`}</CodeBlock>
                </div>
              </div>
            </section>
          ) : null}

          {!routeFound ? (
            <section className="mx-auto max-w-4xl space-y-6 pb-20">
              <SectionHeading
                description="That documentation page does not exist yet."
                id="not-found"
              >
                Page not found
              </SectionHeading>
              <a
                className="inline-flex h-9 items-center rounded-[0.25rem] bg-primary px-4 text-sm font-medium text-primary-foreground"
                href="/components"
                onClick={(event) => navigate(event, "/components")}
              >
                Browse components
              </a>
            </section>
          ) : null}
        </div>

        <StatusRail firstItemTitle={selectedItem?.title ?? firstItem?.title ?? "None"} />
      </main>
      <AppFooter onNavigate={navigate} />
    </div>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found.");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
