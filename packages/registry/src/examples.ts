export const componentUsageExamples = {
  button: `import { Button } from "@brilliantmode/ui/button";

export function Example() {
  return (
    <Button size="md" variant="glow">
      Continue
    </Button>
  );
}

export function KioskExample() {
  return (
    <div className="flex flex-wrap gap-6">
      <Button size="kiosk" variant="tactile">Confirm</Button>
      <Button size="kiosk" variant="molded">Push</Button>
      <Button size="kiosk" variant="gel">Start</Button>
    </div>
  );
}

export function LoadingExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button loading loadingLabel="Saving">Save changes</Button>
      <Button loading loadingLabel="Checking in" size="kiosk" variant="tactile">
        Check in
      </Button>
      <Button aria-label="Loading" loading loadingLabel={null} size="icon" />
    </div>
  );
}`,
  "button-group": `import { Button } from "@brilliantmode/ui/button";
import { ButtonGroup } from "@brilliantmode/ui/button-group";

export function Example() {
  return (
    <ButtonGroup aria-label="View density">
      <Button variant="secondary">Compact</Button>
      <Button variant="primary">Comfortable</Button>
      <Button variant="outline">Touch</Button>
    </ButtonGroup>
  );
}`,
  badge: `import { Badge } from "@brilliantmode/ui/badge";

export function Example() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary">Live</Badge>
      <Badge variant="muted">Enterprise</Badge>
    </div>
  );
}`,
  "aspect-ratio": `import { AspectRatio } from "@brilliantmode/ui/aspect-ratio";

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
} from "@brilliantmode/ui/photo";

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
} from "@brilliantmode/ui/avatar";

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
} from "@brilliantmode/ui/card";
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
  text: `import { Text } from "@brilliantmode/ui/text";

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
  input: `import { Input } from "@brilliantmode/ui/input";

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
} from "@brilliantmode/ui/file-upload";

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
  "photo-upload": `import { PhotoUpload } from "@brilliantmode/ui/photo-upload";
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
  label: `import { Input } from "@brilliantmode/ui/input";
import { Label } from "@brilliantmode/ui/label";

export function Example() {
  return (
    <div className="space-y-2">
      <Label htmlFor="workspace">Workspace name</Label>
      <Input defaultValue="Acme" id="workspace" />
    </div>
  );
}`,
  textarea: `import { Textarea } from "@brilliantmode/ui/textarea";

export function Example() {
  return <Textarea placeholder="Add a launch note..." />;
}`,
  field: `import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@brilliantmode/ui/field";
import { Input } from "@brilliantmode/ui/input";

export function Example() {
  return (
    <Field>
      <FieldLabel htmlFor="workspace-email">Workspace email</FieldLabel>
      <Input id="workspace-email" defaultValue="workspace@company.com" type="email" />
      <FieldDescription>Used for billing and approvals.</FieldDescription>
    </Field>
  );
}`,
  checkbox: `import { Checkbox } from "@brilliantmode/ui/checkbox";

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
  switch: `import { Switch } from "@brilliantmode/ui/switch";

export function Example() {
  return (
    <label className="flex items-center gap-3">
      <Switch aria-label="Enable sync" defaultChecked />
      <span>Enabled</span>
    </label>
  );
}`,
  slider: `import { Slider } from "@brilliantmode/ui/slider";

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
} from "@brilliantmode/ui/select";

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
  combobox: `import { Combobox } from "@brilliantmode/ui/combobox";

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
  "radio-group": `import { RadioGroup, RadioItem } from "@brilliantmode/ui/radio-group";

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
} from "@brilliantmode/ui/alert";

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
} from "@brilliantmode/ui/dialog";

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
} from "@brilliantmode/ui/alert-dialog";
import { Button } from "@brilliantmode/ui/button";

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
} from "@brilliantmode/ui/drawer";

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
} from "@brilliantmode/ui/sheet";

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
  tooltip: `import { Tooltip } from "@brilliantmode/ui/tooltip";

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
} from "@brilliantmode/ui/popover";

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
} from "@brilliantmode/ui/hover-card";

export function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger>Nirvana R</HoverCardTrigger>
      <HoverCardContent>Workspace owner · active now.</HoverCardContent>
    </HoverCard>
  );
}`,
  "context-menu": `import { ContextMenu } from "@brilliantmode/ui/context-menu";

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
} from "@brilliantmode/ui/dropdown-menu";

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
} from "@brilliantmode/ui/tabs";

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
} from "@brilliantmode/ui/accordion";

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
} from "@brilliantmode/ui/collapsible";

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
} from "@brilliantmode/ui/carousel";

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
} from "@brilliantmode/ui/table";

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
} from "@brilliantmode/ui/form";
import { Button } from "@brilliantmode/ui/button";
import { Field, FieldDescription, FieldLabel } from "@brilliantmode/ui/field";
import { Input } from "@brilliantmode/ui/input";

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
  "scroll-area": `import { ScrollArea } from "@brilliantmode/ui/scroll-area";

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
} from "@brilliantmode/ui/breadcrumb";

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
} from "@brilliantmode/ui/navigation-menu";

export function Example() {
  return (
    <NavigationMenu>
      <NavigationMenuLink href="/dashboard">Dashboard</NavigationMenuLink>
      <NavigationMenuLink href="/usage">Usage</NavigationMenuLink>
      <NavigationMenuLink href="/settings">Settings</NavigationMenuLink>
    </NavigationMenu>
  );
}`,
  menubar: `import { Menubar, MenubarItem } from "@brilliantmode/ui/menubar";

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
} from "@brilliantmode/ui/pagination";

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
  separator: `import { Separator } from "@brilliantmode/ui/separator";

export function Example() {
  return <Separator variant="primary" />;
}`,
  skeleton: `import { Skeleton } from "@brilliantmode/ui/skeleton";

export function Example() {
  return <Skeleton size="title" variant="raised" />;
}`,
  progress: `import { Progress } from "@brilliantmode/ui/progress";

export function Example() {
  return <Progress aria-label="Sync progress" value={64} />;
}`,
  spinner: `import { Spinner } from "@brilliantmode/ui/spinner";

export function Example() {
  return <Spinner label="Saving settings" size="md" variant="default" />;
}`,
  toast: `import { ToastProvider, useToast } from "@brilliantmode/ui/toast";

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
  "date-input": `import { DateInput } from "@brilliantmode/ui/date-input";

export function Example() {
  return <DateInput aria-label="Renewal date" defaultValue="2026-08-19" />;
}`,
  calendar: `import { Calendar } from "@brilliantmode/ui/calendar";

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
} from "@brilliantmode/ui/command";

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
} from "@brilliantmode/ui/header";
import { Button } from "@brilliantmode/ui/button";

export function Example() {
  return (
    <Header
      behavior="elevate"
      position="sticky"
      scrollThreshold={24}
      surface="solid"
    >
      <HeaderContainer>
        <HeaderBrand href="/">
          <img alt="" className="size-8" src="/images/brilliant-mark.svg" />
          <span>Brilliant</span>
        </HeaderBrand>
        <HeaderMobileTrigger />
        <HeaderNav align="center">
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
} from "@brilliantmode/ui/footer";

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
          <span>© 2026 Brilliant Mode</span>
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
  ApplicationShellBrand,
  ApplicationShellContent,
  ApplicationShellHeader,
  ApplicationShellHeaderAction,
  ApplicationShellHeaderActions,
  ApplicationShellHeaderBrand,
  ApplicationShellHeaderContent,
  ApplicationShellHeaderDescription,
  ApplicationShellHeaderTitle,
  ApplicationShellFooter,
  ApplicationShellMain,
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
  ApplicationShellSidebarContent,
  ApplicationShellSidebarFooter,
  ApplicationShellSidebarFooterAction,
  ApplicationShellSidebarFooterActions,
  ApplicationShellSidebarHeader,
  ApplicationShellSidebarToggle,
  ApplicationShellTopbar,
  ApplicationShellProfile,
  ApplicationShellProfileMenu,
  ApplicationShellProfileTrigger,
} from "@brilliantmode/ui/application-shell";
import { Button } from "@brilliantmode/ui/button";

export function Example() {
  return (
    <ApplicationShell>
      <ApplicationShellSidebar>
        <ApplicationShellSidebarHeader>
          <ApplicationShellBrand href="/">
            <img alt="" className="size-9" src="/images/brilliant-mark.svg" />
            <span>
              <span className="block text-sm font-semibold">Brilliant</span>
              <span className="block text-xs text-muted-foreground">Component system</span>
            </span>
          </ApplicationShellBrand>
          <ApplicationShellSidebarToggle />
        </ApplicationShellSidebarHeader>
        <ApplicationShellSidebarContent>
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
        </ApplicationShellSidebarContent>

        <ApplicationShellSidebarFooter>
          <ApplicationShellSidebarFooterActions>
            <ApplicationShellSidebarFooterAction icon="?">
              Help and support
            </ApplicationShellSidebarFooterAction>
            <ApplicationShellSidebarFooterAction icon="◐" trailing="⌘ T">
              Appearance
            </ApplicationShellSidebarFooterAction>
          </ApplicationShellSidebarFooterActions>
          <ApplicationShellProfile>
            <ApplicationShellProfileMenu>
              <ApplicationShellMenuSection title="Workspace">
                <ApplicationShellMenuItem trailing="✓">Brilliant Labs</ApplicationShellMenuItem>
                <ApplicationShellMenuItem>Acme Studio</ApplicationShellMenuItem>
              </ApplicationShellMenuSection>
              <ApplicationShellMenuSection>
                <ApplicationShellMenuItem icon="○">Profile settings</ApplicationShellMenuItem>
                <ApplicationShellMenuItem icon="?">Help and support</ApplicationShellMenuItem>
                <ApplicationShellMenuItem icon="↪">Sign out</ApplicationShellMenuItem>
              </ApplicationShellMenuSection>
            </ApplicationShellProfileMenu>
            <ApplicationShellProfileTrigger
              description="dianne@brilliant.dev"
              media={<ApplicationShellNavMedia>DR</ApplicationShellNavMedia>}
              trailing="⌃"
            >
              Dianne Russell
            </ApplicationShellProfileTrigger>
          </ApplicationShellProfile>
        </ApplicationShellSidebarFooter>
      </ApplicationShellSidebar>

      <ApplicationShellContent>
        <ApplicationShellHeader>
          <ApplicationShellMobileTrigger />
          <ApplicationShellHeaderBrand href="/">
            <img alt="" className="size-7" src="/images/brilliant-mark.svg" />
            <span className="hidden sm:inline">Brilliant</span>
          </ApplicationShellHeaderBrand>
          <ApplicationShellHeaderContent>
            <ApplicationShellHeaderTitle>Dashboard</ApplicationShellHeaderTitle>
            <ApplicationShellHeaderDescription>Live workspace overview</ApplicationShellHeaderDescription>
          </ApplicationShellHeaderContent>
          <ApplicationShellHeaderActions>
            <ApplicationShellHeaderAction aria-label="Help">?</ApplicationShellHeaderAction>
            <ApplicationShellHeaderAction aria-label="Notifications">
              ♢
              <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
            </ApplicationShellHeaderAction>
            <Button className="ml-1" size="sm" variant="glow">
              New report
            </Button>
          </ApplicationShellHeaderActions>
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
        <ApplicationShellFooter className="flex flex-wrap items-center justify-between gap-3">
          <span>© 2026 Brilliant</span>
          <a className="hover:text-foreground" href="/status">System status</a>
        </ApplicationShellFooter>
      </ApplicationShellContent>
    </ApplicationShell>
  );
}

export function PortalExample() {
  return (
    <ApplicationShell variant="portal">
      <ApplicationShellTopbar>
        <a className="inline-flex items-center gap-2 font-semibold" href="/">
          <img alt="" className="size-7" src="/images/brilliant-mark.svg" />
          Brilliant
        </a>
        <button className="ml-auto text-sm text-muted-foreground" type="button">
          Sign out
        </button>
      </ApplicationShellTopbar>

      <ApplicationShellSidebar>
        <ApplicationShellSidebarContent>
          <ApplicationShellNav>
            <ApplicationShellNavSection>
              {['Overview', 'Applications', 'Channel partners', 'Settings'].map((item, index) => (
                <ApplicationShellNavItem
                  aria-current={index === 1 ? 'page' : undefined}
                  href={'/' + item.toLowerCase().replace(' ', '-')}
                  icon="□"
                  key={item}
                >
                  {item}
                </ApplicationShellNavItem>
              ))}
            </ApplicationShellNavSection>
          </ApplicationShellNav>
        </ApplicationShellSidebarContent>
      </ApplicationShellSidebar>

      <ApplicationShellContent>
        <ApplicationShellHeader>
          <ApplicationShellMobileTrigger />
          <ApplicationShellHeaderContent>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              UF internal
            </p>
            <ApplicationShellHeaderTitle>Channel partner operations</ApplicationShellHeaderTitle>
            <ApplicationShellHeaderDescription>
              Review applications, approve accounts, and manage the partner portal surface.
            </ApplicationShellHeaderDescription>
          </ApplicationShellHeaderContent>
          <ApplicationShellHeaderActions>
            <span className="rounded bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
              Super admin
            </span>
          </ApplicationShellHeaderActions>
        </ApplicationShellHeader>
        <ApplicationShellMain>
          <section className="rounded-[0.75rem] border border-border bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Channel partner applications</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submitted self-serve and operator-entered applications.
            </p>
          </section>
        </ApplicationShellMain>
        <ApplicationShellFooter className="flex flex-wrap items-center justify-between gap-3">
          <span>Partner operations</span>
          <a className="hover:text-foreground" href="/support">Support</a>
        </ApplicationShellFooter>
      </ApplicationShellContent>
    </ApplicationShell>
  );
}

function KioskActionIcon({
  name,
}: {
  name: "check-in" | "tickets" | "booking" | "help";
}) {
  const paths = {
    "check-in": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M19 8v6 M22 11h-6",
    tickets: "M2 9a3 3 0 0 0 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 0 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z M13 5v2 M13 17v2 M13 11v2",
    booking: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2 M9 15l2 2 4-4",
    help: "M4 13a8 8 0 0 1 16 0 M4 13v5a2 2 0 0 0 2 2h2v-7H4 M20 13h-4v7h2a2 2 0 0 0 2-2z M16 20c0 1.1-.9 2-2 2h-2",
  } as const;

  return (
    <svg
      aria-hidden="true"
      className="size-6 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export function KioskExample() {
  return (
    <ApplicationShell variant="kiosk">
      <ApplicationShellTopbar>
        <a className="inline-flex items-center gap-2 font-semibold" href="/">
          <img alt="" className="size-8" src="/images/brilliant-mark.svg" />
          Brilliant
        </a>
        <div className="ml-auto flex items-center gap-2">
          <Button size="kiosk" variant="molded">English</Button>
          <Button aria-label="Accessibility options" size="kiosk" variant="molded">
            Aa
          </Button>
        </div>
      </ApplicationShellTopbar>

      <ApplicationShellContent>
        <ApplicationShellHeader>
          <ApplicationShellHeaderContent>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Step 1 of 3
            </p>
            <ApplicationShellHeaderTitle>How can we help?</ApplicationShellHeaderTitle>
            <ApplicationShellHeaderDescription>
              Choose one option to begin. You can return to this screen at any time.
            </ApplicationShellHeaderDescription>
          </ApplicationShellHeaderContent>
        </ApplicationShellHeader>

        <ApplicationShellMain>
          <div className="grid w-full max-w-3xl gap-5 sm:grid-cols-2">
            <Button size="kiosk" variant="tactile">
              <KioskActionIcon name="check-in" />
              Check in
            </Button>
            <Button size="kiosk" variant="tactile">
              <KioskActionIcon name="tickets" />
              Buy tickets
            </Button>
            <Button size="kiosk" variant="gel">
              <KioskActionIcon name="booking" />
              Find a booking
            </Button>
            <Button size="kiosk" variant="gel">
              <KioskActionIcon name="help" />
              Ask for help
            </Button>
          </div>
        </ApplicationShellMain>

        <ApplicationShellFooter className="flex items-center justify-between gap-4">
          <span>This session resets after 60 seconds of inactivity.</span>
          <Button size="kiosk" variant="molded">Start over</Button>
        </ApplicationShellFooter>
      </ApplicationShellContent>
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
} from "@brilliantmode/ui/onboarding-wizard";

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
  chart: `import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@brilliantmode/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 273, mobile: 190 },
  { month: "May", desktop: 309, mobile: 230 },
  { month: "Jun", desktop: 364, mobile: 280 },
];

const config = {
  desktop: { color: "var(--brilliant-chart-1)", label: "Desktop" },
  mobile: { color: "var(--brilliant-chart-2)", label: "Mobile" },
} satisfies ChartConfig;

export function Example() {
  return (
    <ChartContainer
      className="h-72"
      config={config}
      description="Monthly desktop and mobile traffic from January through June."
      title="Traffic overview"
    >
      <LineChart accessibilityLayer data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis axisLine={false} dataKey="month" tickLine={false} tickMargin={10} />
        <YAxis axisLine={false} tickLine={false} width={34} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="desktop" dot={false} isAnimationActive="auto" stroke="var(--color-desktop)" strokeWidth={2} type="monotone" />
        <Line dataKey="mobile" dot={false} isAnimationActive="auto" stroke="var(--color-mobile)" strokeWidth={2} type="monotone" />
      </LineChart>
    </ChartContainer>
  );
}`,
  stat: `import {
  Stat,
  StatDescription,
  StatHeader,
  StatLabel,
  StatValue,
  TrendIndicator,
} from "@brilliantmode/ui/stat";
import { Sparkline } from "@brilliantmode/ui/chart";

export function Example() {
  return (
    <Stat>
      <StatHeader>
        <StatLabel>Net revenue</StatLabel>
        <TrendIndicator direction="positive" value="12.4%" />
      </StatHeader>
      <div className="flex items-end justify-between gap-3">
        <StatValue>$128,430</StatValue>
        <Sparkline data={[18, 24, 21, 29, 31, 37, 44]} label="Revenue trend" />
      </div>
      <StatDescription>Compared with the previous 30 days</StatDescription>
    </Stat>
  );
}`,
  status: `import { Status, StatusBar } from "@brilliantmode/ui/status";

export function Example() {
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap gap-4">
        <Status pulse tone="positive">All systems operational</Status>
        <Status tone="warning">Elevated latency</Status>
        <Status tone="critical">Billing sync interrupted</Status>
      </div>
      <StatusBar
        items={[
          { label: "Healthy", tone: "positive", value: 82 },
          { label: "Degraded", tone: "warning", value: 12 },
          { label: "Failed", tone: "critical", value: 6 },
        ]}
      />
    </div>
  );
}`,
  meter: `import { Meter } from "@brilliantmode/ui/meter";
import { useState } from "react";

export function Example() {
  const [usage, setUsage] = useState(64);
  return (
    <div className="grid gap-5">
      <Meter
        label="Monthly events"
        max={100}
        tone={usage > 85 ? "critical" : usage > 70 ? "warning" : "default"}
        value={usage}
        valueLabel={\`\${usage}%\`}
      />
      <input aria-label="Adjust usage" max={100} min={0} onChange={(event) => setUsage(event.currentTarget.valueAsNumber)} type="range" value={usage} />
    </div>
  );
}`,
  "dashboard-layout": `import {
  DashboardActions,
  DashboardDescription,
  DashboardGrid,
  DashboardHeader,
  DashboardLayout,
  DashboardSection,
  DashboardSectionHeader,
  DashboardSectionTitle,
  DashboardTitle,
} from "@brilliantmode/ui/dashboard-layout";
import { Meter } from "@brilliantmode/ui/meter";
import { Stat, StatLabel, StatValue } from "@brilliantmode/ui/stat";
import { Status } from "@brilliantmode/ui/status";

export function Example() {
  return (
    <DashboardLayout>
      <DashboardHeader>
        <div>
          <DashboardTitle>Operations overview</DashboardTitle>
          <DashboardDescription>Production workspace · updated moments ago</DashboardDescription>
        </div>
        <DashboardActions><button type="button">Export</button></DashboardActions>
      </DashboardHeader>
      <DashboardGrid>
        {[['Revenue', '$128K'], ['Users', '24.8K'], ['Uptime', '99.99%'], ['Incidents', '2']].map(([label, value]) => (
          <Stat key={label}><StatLabel>{label}</StatLabel><StatValue>{value}</StatValue></Stat>
        ))}
      </DashboardGrid>
      <DashboardSection>
        <DashboardSectionHeader>
          <DashboardSectionTitle>Capacity</DashboardSectionTitle>
          <Status tone="positive">Healthy</Status>
        </DashboardSectionHeader>
        <Meter label="Event capacity" value={68} valueLabel="6.8M / 10M" />
      </DashboardSection>
    </DashboardLayout>
  );
}`,
  "empty-state": `import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@brilliantmode/ui/empty-state";

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
