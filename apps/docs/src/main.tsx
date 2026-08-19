import { registry } from "@brilliant-ui/registry";
import { type ReactNode, StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

type NavItem = readonly [label: string, href: `#${string}`];
type NavGroup = {
  label: string;
  items: readonly NavItem[];
};

const navGroups = [
  {
    items: [
      ["Getting Started", "#getting-started"],
      ["Why Brilliant", "#why-brilliant"],
      ["shadcn", "#shadcn"],
      ["Components", "#components"],
    ],
    label: "Start",
  },
  {
    items: [
      ["Button", "#button"],
      ["Button Group", "#button-group"],
      ["Badge", "#badge"],
      ["Card", "#card"],
      ["Text", "#text"],
      ["Avatar", "#avatar"],
      ["Aspect Ratio", "#aspect-ratio"],
      ["Separator", "#separator"],
    ],
    label: "Display",
  },
  {
    items: [
      ["Input", "#input"],
      ["Label", "#label"],
      ["Textarea", "#textarea"],
      ["Field", "#field"],
      ["Checkbox", "#checkbox"],
      ["Switch", "#switch"],
      ["Radio Group", "#radio-group"],
      ["Slider", "#slider"],
      ["Select", "#select"],
      ["Combobox", "#combobox"],
      ["Calendar", "#calendar"],
      ["Date Input", "#date-input"],
      ["Form", "#form"],
    ],
    label: "Forms",
  },
  {
    items: [
      ["Dialog", "#dialog"],
      ["Alert Dialog", "#alert-dialog"],
      ["Drawer", "#drawer"],
      ["Sheet", "#sheet"],
      ["Dropdown Menu", "#dropdown-menu"],
      ["Tooltip", "#tooltip"],
      ["Popover", "#popover"],
      ["Hover Card", "#hover-card"],
      ["Context Menu", "#context-menu"],
      ["Command", "#command"],
    ],
    label: "Overlays",
  },
  {
    items: [
      ["Alert", "#alert"],
      ["Skeleton", "#skeleton"],
      ["Progress", "#progress"],
      ["Spinner", "#spinner"],
      ["Empty State", "#empty-state"],
      ["Toast", "#toast"],
    ],
    label: "Feedback",
  },
  {
    items: [
      ["Tabs", "#tabs"],
      ["Accordion", "#accordion"],
      ["Collapsible", "#collapsible"],
      ["Carousel", "#carousel"],
      ["Table", "#table"],
      ["Scroll Area", "#scroll-area"],
      ["Breadcrumb", "#breadcrumb"],
      ["Navigation Menu", "#navigation-menu"],
      ["Menubar", "#menubar"],
      ["Pagination", "#pagination"],
    ],
    label: "Navigation & data",
  },
  {
    items: [
      ["Application Shell", "#application-shell"],
      ["Foundations", "#foundations"],
      ["Blocks", "#blocks"],
      ["Theming", "#theming"],
      ["CLI", "#cli"],
    ],
    label: "System",
  },
] as const satisfies readonly NavGroup[];

const navItems: NavItem[] = (navGroups as readonly NavGroup[]).flatMap((group) => group.items);

const topNavItems = [
  ["Docs", "#getting-started"],
  ["Components", "#components"],
  ["Foundations", "#foundations"],
  ["Blocks", "#blocks"],
  ["Theming", "#theming"],
  ["CLI", "#cli"],
] as const satisfies readonly NavItem[];

type NavHref = (typeof navItems)[number][1];

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

const premiumSystems = [
  ["AI workspace", "Prompt input, tool-call timeline, citations, approvals, agent status"],
  ["Access control", "Roles, permissions, policy builder, audit explorer, identity timeline"],
  ["SaaS operations", "Billing, usage meters, API keys, webhooks, members, feature flags"],
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
      <Button variant="outline">Comfortable</Button>
      <Button variant="outline">Touch</Button>
    </ButtonGroup>
  );
}`,
  badge: `import { Badge } from "@/components/ui/badge";

export function Example() {
  return <Badge variant="primary">Live</Badge>;
}`,
  "aspect-ratio": `import { AspectRatio } from "@/components/ui/aspect-ratio";

export function Example() {
  return (
    <AspectRatio ratio={16 / 9}>
      <img alt="Dashboard preview" className="size-full object-cover" src="/preview.png" />
    </AspectRatio>
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
    <Avatar size="md">
      <AvatarFallback>NR</AvatarFallback>
      <AvatarImage alt="Nirvana" src="/avatars/nirvana.png" />
      <AvatarStatus status="online" />
    </Avatar>
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
    <Card beam={isProcessing} interactive variant="elevated">
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>Current billing period</CardDescription>
      </CardHeader>
      <CardContent>2.4M events</CardContent>
    </Card>
  );
}`,
  text: `import { Text } from "@/components/ui/text";

export function Example() {
  return (
    <Text as="span" shimmerColor="white" size="lg" variant="shimmer">
      Generating workspace insights
    </Text>
  );
}`,
  input: `import { Input } from "@/components/ui/input";

export function Example() {
  return <Input placeholder="workspace@company.com" type="email" />;
}`,
  label: `import { Label } from "@/components/ui/label";

export function Example() {
  return <Label htmlFor="workspace">Workspace name</Label>;
}`,
  textarea: `import { Textarea } from "@/components/ui/textarea";

export function Example() {
  return <Textarea placeholder="Add a launch note..." />;
}`,
  field: `import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function Example() {
  return (
    <Field>
      <FieldLabel htmlFor="workspace-email">Workspace email</FieldLabel>
      <Input id="workspace-email" placeholder="workspace@company.com" type="email" />
      <FieldDescription>Used for billing and approvals.</FieldDescription>
      <FieldError>{/* Validation message */}</FieldError>
    </Field>
  );
}`,
  checkbox: `import { Checkbox } from "@/components/ui/checkbox";

export function Example() {
  return (
    <label className="flex items-center gap-3">
      <Checkbox defaultChecked size="lg" />
      <span>Require approval</span>
    </label>
  );
}`,
  switch: `import { Switch } from "@/components/ui/switch";

export function Example() {
  return <Switch aria-label="Enable sync" defaultChecked />;
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
    <RadioGroup aria-label="Billing plan" size="md">
      <RadioItem defaultChecked label="Pro" name="plan" value="pro" />
      <RadioItem
        description="SAML, SCIM, audit logs"
        label="Enterprise"
        name="plan"
        value="enterprise"
        variant="default"
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
        <ApplicationShellBrand href="/">Brilliant</ApplicationShellBrand>
        <ApplicationShellSearch href="/search">
          Search docs <kbd>/</kbd>
        </ApplicationShellSearch>
        <ApplicationShellNav>
          <ApplicationShellNavSection title="Main">
            <ApplicationShellNavItem active href="/dashboard">
              Dashboard
            </ApplicationShellNavItem>
            <ApplicationShellNavItem href="/settings">Settings</ApplicationShellNavItem>
          </ApplicationShellNavSection>
          <ApplicationShellNavSection title="Inboxes">
            <ApplicationShellNavGroupItem
              description="(209) 555-0104"
              href="/clients"
              media={<ApplicationShellNavMedia tone="primary">C</ApplicationShellNavMedia>}
            >
              Clients
            </ApplicationShellNavGroupItem>
          </ApplicationShellNavSection>
        </ApplicationShellNav>
        <ApplicationShellMenu>
          <ApplicationShellMenuItem icon="◐">Set yourself as away</ApplicationShellMenuItem>
          <ApplicationShellMenuItem active icon="🔕">Pause notifications</ApplicationShellMenuItem>
          <ApplicationShellMenuSection title="Accounts">
            <ApplicationShellMenuItem trailing="✓">Dianne Russell</ApplicationShellMenuItem>
            <ApplicationShellMenuItem>AG Studio</ApplicationShellMenuItem>
          </ApplicationShellMenuSection>
        </ApplicationShellMenu>
        <ApplicationShellAccountSwitcher>
          <ApplicationShellAccountItem
            description="russel@hey.com"
            media={<ApplicationShellNavMedia>D</ApplicationShellNavMedia>}
            trailing="⌄"
          >
            Dianne Russell
          </ApplicationShellAccountItem>
        </ApplicationShellAccountSwitcher>
      </ApplicationShellSidebar>

      <div className="min-w-0">
        <ApplicationShellHeader>
          <ApplicationShellMobileTrigger />
          <h1 className="text-sm font-semibold">Dashboard</h1>
        </ApplicationShellHeader>
        <ApplicationShellMain>Route content goes here.</ApplicationShellMain>
      </div>
    </ApplicationShell>
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

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-surface p-4 text-sm leading-6">
      <code>{children}</code>
    </pre>
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

function ComponentMiniPreview({ name }: { name: string }) {
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

  if (name === "avatar") {
    return (
      <div className="flex items-end gap-4">
        {[
          ["sm", "NR", "size-7 text-xs", "size-2"],
          ["md", "BU", "size-9 text-sm", "size-2.5"],
          ["lg", "AI", "size-11 text-base", "size-3"],
          ["xl", "UF", "size-14 text-lg", "size-3.5"],
        ].map(([label, initials, rootSize, statusSize]) => (
          <div
            className={[
              "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-medium uppercase text-muted-foreground shadow-[inset_0_0_0_0.5px_var(--brilliant-control-border)]",
              rootSize,
            ].join(" ")}
            key={label}
          >
            {initials}
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

function DocsSidebarHeader() {
  return (
    <div className="mb-5 space-y-3">
      <a className="flex items-center gap-3" href="#getting-started">
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
      <a
        className="flex h-9 items-center gap-2 rounded-[0.375rem] border border-border bg-surface px-3 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
        href="#components"
      >
        <span aria-hidden="true" className="text-base leading-none">
          ⌕
        </span>
        <span className="min-w-0 flex-1 truncate">Search docs</span>
        <kbd className="rounded-[0.25rem] border border-border bg-background px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
          /
        </kbd>
      </a>
    </div>
  );
}

function NavGlyph({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "mt-px grid size-5 shrink-0 place-items-center rounded-[0.3125rem] border transition-colors",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground",
      ].join(" ")}
    >
      <span className="size-1.5 rounded-[0.1875rem] border border-current" />
    </span>
  );
}

function DocsNavGroup({
  activeHref,
  group,
  onNavigate,
}: {
  activeHref: NavHref;
  group: NavGroup;
  onNavigate: (() => void) | undefined;
}) {
  return (
    <section className="pb-4 last:pb-0">
      <h2 className="mb-1.5 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {group.label}
      </h2>
      <ul className="space-y-0.5">
        {group.items.map(([label, href]) => (
          <li key={href}>
            <a
              aria-current={activeHref === href ? "location" : undefined}
              className={[
                "group flex items-center gap-2 rounded-[0.375rem] px-2 py-1.5 text-sm leading-5 transition-colors",
                activeHref === href
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
              href={href}
              onClick={onNavigate}
            >
              <NavGlyph active={activeHref === href} />
              <span className="min-w-0 truncate">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DocsNav({ activeHref, onNavigate }: { activeHref: NavHref; onNavigate?: () => void }) {
  return (
    <nav aria-label="Documentation" className="text-sm">
      <DocsSidebarHeader />
      <div>
        {navGroups.map((group) => (
          <DocsNavGroup
            activeHref={activeHref}
            group={group}
            key={group.label}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}

function isTopNavActive(activeHref: NavHref, topHref: (typeof topNavItems)[number][1]) {
  if (topHref === "#getting-started") {
    return (
      activeHref === "#getting-started" ||
      activeHref === "#why-brilliant" ||
      activeHref === "#shadcn"
    );
  }

  if (topHref === "#components") {
    return (
      activeHref === "#components" ||
      registry.some((item) => activeHref === (`#${item.name}` as NavHref))
    );
  }

  return activeHref === topHref;
}

function AppHeader({ activeHref, onMenuClick }: { activeHref: NavHref; onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/82">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-4 md:px-6">
        <button
          aria-controls="mobile-docs-nav"
          aria-label="Open documentation navigation"
          className="inline-flex size-9 items-center justify-center rounded-[0.25rem] border border-border bg-surface text-foreground transition-colors hover:bg-muted md:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ☰
          </span>
        </button>
        <a className="shrink-0 whitespace-nowrap text-sm font-semibold tracking-tight" href="/">
          Brilliant UI
        </a>
        <nav
          aria-label="Primary"
          className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm text-muted-foreground md:flex"
        >
          {topNavItems.map(([label, href]) => (
            <a
              aria-current={isTopNavActive(activeHref, href) ? "page" : undefined}
              className={[
                "shrink-0 whitespace-nowrap rounded-[0.25rem] px-3 py-1.5 transition-colors hover:bg-muted hover:text-foreground",
                isTopNavActive(activeHref, href) ? "bg-primary/10 text-foreground" : "",
              ].join(" ")}
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Badge tone="ready">v0.1 foundation</Badge>
        </div>
      </div>
    </header>
  );
}

function MobileDocsNav({
  activeHref,
  onClose,
  open,
}: {
  activeHref: NavHref;
  onClose: () => void;
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
          <a className="text-sm font-semibold tracking-tight" href="/" onClick={onClose}>
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
        <DocsNav activeHref={activeHref} onNavigate={onClose} />
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

function AppFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto grid max-w-screen-2xl gap-4 px-4 py-6 text-sm text-muted-foreground md:grid-cols-[280px_minmax(0,1fr)_280px] md:px-6">
        <p className="font-medium text-foreground">Brilliant UI</p>
        <p>
          Copy-owned shadcn-compatible source, enterprise-grade tokens, and micro UX primitives.
        </p>
        <div className="flex flex-wrap gap-3 md:justify-end">
          {topNavItems.map(([label, href]) => (
            <a className="hover:text-foreground" href={href} key={href}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function App() {
  const firstItem = registry[0];
  const [activeHref, setActiveHref] = useState<NavHref>("#getting-started");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const sectionIds = navItems.map(([, href]) => href.slice(1));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (sections.length === 0) {
      return;
    }

    const setActiveFromScroll = () => {
      const currentSection = sections
        .filter((section) => section.getBoundingClientRect().top <= 120)
        .at(-1);

      if (currentSection) {
        setActiveHref(`#${currentSection.id}` as (typeof navItems)[number][1]);
        return;
      }

      const firstSection = sections[0];
      if (firstSection) {
        setActiveHref(`#${firstSection.id}` as (typeof navItems)[number][1]);
      }
    };

    setActiveFromScroll();
    window.addEventListener("scroll", setActiveFromScroll, { passive: true });
    window.addEventListener("hashchange", setActiveFromScroll);

    return () => {
      window.removeEventListener("scroll", setActiveFromScroll);
      window.removeEventListener("hashchange", setActiveFromScroll);
    };
  }, []);

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
        href="#getting-started"
      >
        Skip to content
      </a>
      <AppHeader activeHref={activeHref} onMenuClick={() => setMobileNavOpen(true)} />
      <MobileDocsNav
        activeHref={activeHref}
        onClose={() => setMobileNavOpen(false)}
        open={mobileNavOpen}
      />

      <main className="mx-auto grid max-w-screen-2xl md:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-border px-6 py-6 md:block">
          <DocsNav activeHref={activeHref} />
        </aside>

        <div className="min-w-0 px-4 py-10 md:px-8 lg:px-10">
          <section className="mx-auto max-w-4xl pb-14" id="getting-started">
            <Badge tone="ready">shadcn-compatible enterprise UI</Badge>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
              shadcn-compatible components with premium micro UX built in.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Brilliant UI keeps the copy-owned shadcn workflow, then adds brandable tokens,
              enterprise-grade defaults, restrained animation primitives, and product-ready blocks
              for SaaS, internal tools, and AI apps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                className="inline-flex h-9 items-center rounded-[0.25rem] bg-primary px-4 text-sm font-medium text-primary-foreground"
                href="#cli"
              >
                Get started
              </a>
              <a
                className="inline-flex h-9 items-center rounded-[0.25rem] border border-border px-4 text-sm font-medium"
                href="#components"
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
                  The generated files follow shadcn conventions: Radix where appropriate, Tailwind
                  semantic classes, editable source, components aliases, and app-owned code. The
                  Brilliant layer adds tokens, micro UX, enterprise styling, metadata, and product
                  composition rules.
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Implemented registry items that can be installed into an app today."
              id="components"
            >
              Components
            </SectionHeading>

            <CodeBlock>{`npx brilliant-ui add ${registry.map((item) => item.name).join(" ")}`}</CodeBlock>

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
                          href={`#${item.name}`}
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

          <section className="mx-auto max-w-4xl space-y-8 pb-14">
            <div className="scroll-mt-24" id="button">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-3xl font-semibold tracking-tight">Button</h2>
                <Badge tone="ready">available</Badge>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Displays a button or a component that looks like a button. Use it for actions inside
                forms, dialogs, toolbars, and application screens. Motion, focus, disabled, and
                reduced-motion behavior are part of the generated source.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Installation</h3>
              <CodeBlock>{`pnpm --filter @brilliant-ui/cli dev -- add button`}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Usage</h3>
              <CodeBlock>{`import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Button size="md" variant="primary">
      Save changes
    </Button>
  );
}`}</CodeBlock>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="rounded-lg border border-border bg-background p-6">
                <PreviewButton className={`${buttonVariants[0][2]} h-9 px-3.5 text-sm`}>
                  Save changes
                </PreviewButton>
              </div>
            </div>

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
                  Registry metadata is used by the CLI and AI composition tooling. It is shown here
                  as supporting information, not as the component documentation itself.
                </p>
              </div>
            </details>
          </section>

          {registry
            .filter((item) => item.name !== "button")
            .map((item) => {
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
                    <CodeBlock>{`npx brilliant-ui add ${item.name}`}</CodeBlock>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Usage</h3>
                    <CodeBlock>{usage}</CodeBlock>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Preview</h3>
                    <div className="rounded-lg border border-border bg-background p-6">
                      <ComponentMiniPreview name={item.name} />
                    </div>
                  </div>

                  {item.name === "card" ||
                  item.name === "text" ||
                  item.name === "checkbox" ||
                  item.name === "radio-group" ||
                  item.name === "separator" ||
                  item.name === "skeleton" ||
                  item.name === "progress" ||
                  item.name === "spinner" ||
                  item.name === "empty-state" ? (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">Variants</h3>
                      <div className="overflow-auto rounded-lg border border-border">
                        <table className="w-full border-collapse text-sm">
                          <thead className="bg-muted text-left">
                            <tr>
                              <th className="border-b border-border px-4 py-3 font-medium">
                                Variant
                              </th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(item.name === "card"
                              ? [
                                  ["surface", "Default content grouping."],
                                  ["elevated", "Raised dashboard or summary surfaces."],
                                  ["accent", "Selected, highlighted, or recommended content."],
                                  ["beam", "Premium live, AI, processing, or highlighted states."],
                                  ["muted", "Low-emphasis grouping inside denser layouts."],
                                  ["ghost", "Structure without a visible panel."],
                                ]
                              : item.name === "checkbox"
                                ? [
                                    ["default", "Normal selection state."],
                                    ["critical", "Destructive or high-risk selection context."],
                                  ]
                                : item.name === "radio-group"
                                  ? [
                                      ["default", "Normal single-choice selection."],
                                      ["critical", "High-risk or destructive choice context."],
                                    ]
                                  : item.name === "separator"
                                    ? [
                                        ["default", "Standard divider using the border token."],
                                        ["muted", "Subtle divider for dense grouped content."],
                                        ["primary", "Branded or active section divider."],
                                      ]
                                    : item.name === "progress"
                                      ? [
                                          ["default", "Normal progress indication."],
                                          ["critical", "Risky, blocking, or destructive flows."],
                                        ]
                                      : item.name === "spinner"
                                        ? [
                                            ["default", "Primary local loading indicator."],
                                            ["muted", "Secondary loading next to text."],
                                            ["critical", "Loading tied to risky/error recovery."],
                                          ]
                                        : item.name === "empty-state"
                                          ? [
                                              ["surface", "Default empty region panel."],
                                              ["muted", "Lower-emphasis empty region."],
                                              ["ghost", "Use inside an already bordered surface."],
                                            ]
                                          : item.name === "skeleton"
                                            ? [
                                                ["surface", "Default loading placeholder."],
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
                                                ["muted", "Secondary or supporting copy."],
                                                ["glow", "Premium, active, or AI-ready emphasis."],
                                                [
                                                  "shimmer",
                                                  "Generating, syncing, or live processing text.",
                                                ],
                                              ]
                            ).map(([variant, use]) => (
                              <tr className="border-b border-border last:border-b-0" key={variant}>
                                <td className="px-4 py-3 font-mono text-xs">{variant}</td>
                                <td className="px-4 py-3 text-muted-foreground">{use}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {item.name === "card" ? (
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
                          <code>RadioItem</code> only when the choice itself carries risk. Items in
                          the same group should share the same <code>name</code>.
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
                          Use <code>label</code> to describe the loading operation for screen reader
                          users. Prefer <code>variant=&quot;muted&quot;</code> beside visible copy.
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
                          <code>--brilliant-text-shimmer-highlight</code> globally. The animation is
                          disabled for reduced-motion users.
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
                              <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
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
                              <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
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
                              <th className="border-b border-border px-4 py-3 font-medium">Prop</th>
                              <th className="border-b border-border px-4 py-3 font-medium">Use</th>
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
            })}

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

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="Higher-level systems that make Brilliant more than primitive wrappers."
              id="blocks"
            >
              Product systems
            </SectionHeading>
            <div className="grid gap-4">
              {premiumSystems.map(([title, description]) => (
                <article
                  className="rounded-lg border border-border bg-surface p-5 hover:border-primary/30"
                  key={title}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{title}</h3>
                    <Badge>planned</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
            <div className="pt-2">
              <h3 className="text-lg font-semibold">Block families</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {blockGroups.map(([title, description]) => (
                <article className="rounded-lg border border-border bg-surface p-5" key={title}>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold">{title}</h3>
                    <Badge>planned</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-4xl space-y-6 pb-14">
            <SectionHeading
              description="The default indigo is only a starting point; production apps can own their brand."
              id="theming"
            >
              Brand theming
            </SectionHeading>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
              <CodeBlock>{`:root {
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
                <CodeBlock>{`TMP_DEMO=$(mktemp -d)
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- init --cwd "$TMP_DEMO"
pnpm --dir /Users/nirvana/brilliant-ui --filter @brilliant-ui/cli dev -- add button --cwd "$TMP_DEMO"
find "$TMP_DEMO" -maxdepth 4 -type f | sort`}</CodeBlock>
              </div>
            </div>
          </section>
        </div>

        <StatusRail firstItemTitle={firstItem?.title ?? "None"} />
      </main>
      <AppFooter />
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
