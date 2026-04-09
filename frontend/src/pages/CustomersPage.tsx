/**
 * @module CustomersPage
 * Main customer management page (Requirement 1.1).
 * Implements "Table-to-Drawer" navigation and server-side pagination.
 */
import { useState } from "react";
import { 
  Heading, 
  VStack, 
  Stack, 
  Separator, 
  Button, 
  Box,
  useDisclosure
} from "@chakra-ui/react";
import { LuFileText, LuCircleUser, LuChevronRight } from "react-icons/lu";

// Shared UI Components
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppTable, type AppTableColumn } from "@/components/shared/organisms/AppTable";
import { AdaptiveDialog } from "@/components/shared/molecules/AdaptiveDialog";
import { EntityDetailGrid } from "@/components/shared/molecules/EntityDetailGrid";
import { TrackListTable } from "@/components/shared/organisms/TrackListTable";
import { ActionIconButton } from "@/components/shared/atoms/ActionIconButton";
import { AppPagination } from "@/components/shared/molecules/AppPagination";

// Hooks & Types
import { 
  useCustomers, 
  useCustomerInvoices, 
  useCustomerAgent 
} from "@/services/hooks/queries/use-customers";
import { useTracks } from "@/services/hooks/queries/use-music";
import { type Customer, type Invoice } from "@project/shared";

type DrawerStage = "DETAILS" | "INVOICES" | "AGENT" | "TRACKS";

export const CustomersPage = () => {
  // 1. Pagination State
  const [params, setParams] = useState({ page: 1, limit: 10 });
  
  // Use paginated hook - now receives { data, meta }
  const { data: response, isLoading, isError, refetch } = useCustomers(params);

  // 2. Dialog & UI State
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [stage, setStage] = useState<DrawerStage>("DETAILS");

  // 3. Table Column Configuration
  const columns: AppTableColumn<Customer>[] = [
    { header: "First Name", accessor: "firstName", isPriority: true },
    { header: "Last Name", accessor: "lastName", isPriority: true },
    { header: "City", accessor: "city" },
    { header: "Country", accessor: "country" },
    { header: "Email", accessor: "email" },
    {
      header: "Actions",
      accessor: (customer) => (
        <Stack direction="row" gap={2}>
          <ActionIconButton 
            icon={LuFileText} 
            label="Invoices" 
            onClick={() => handleOpenStage(customer, "INVOICES")} 
          />
          <ActionIconButton 
            icon={LuCircleUser} 
            label="Agent" 
            colorPalette="gray"
            onClick={() => handleOpenStage(customer, "AGENT")} 
          />
        </Stack>
      ),
    },
  ];

  // 4. Navigation Logic
  const handleOpenStage = (customer: Customer, targetStage: DrawerStage = "DETAILS") => {
    setSelectedCustomer(customer);
    setStage(targetStage);
    onOpen();
  };

  const handleBack = () => {
    if (stage === "TRACKS") setStage("INVOICES");
    else setStage("DETAILS");
  };

  const getTitle = () => {
    switch (stage) {
      case "DETAILS": return "Customer Info";
      case "INVOICES": return "Customer Invoices";
      case "AGENT": return "Support Representative";
      case "TRACKS": return `Tracks for Invoice #${selectedInvoice?.invoiceId}`;
      default: return "";
    }
  };

  return (
    <VStack gap={6} align="stretch" w="full">
      <Heading size="xl" fontWeight="black" letterSpacing="tight">
        CUSTOMERS
      </Heading>

      <AppPanel>
        <DataStateWrapper 
          isLoading={isLoading} 
          isError={isError} 
          isEmpty={response?.data.length === 0}
          onRetry={refetch}
        >
          <VStack align="stretch" gap={4}>
            <AppTable 
              data={response?.data || []} 
              columns={columns} 
              keyExtractor={(c) => c.customerId}
              onDetailClick={(c) => handleOpenStage(c, "DETAILS")}
            />
            
            {/* Using the unified pagination component */}
            {response?.meta && (
              <AppPagination 
                page={response.meta.page}
                totalPages={response.meta.totalPages}
                totalItems={response.meta.total}
                onPageChange={(newPage) => setParams(p => ({ ...p, page: newPage }))}
              />
            )}
          </VStack>
        </DataStateWrapper>
      </AppPanel>

      <AdaptiveDialog 
        isOpen={open} 
        onClose={onClose} 
        title={getTitle()}
        onBack={stage !== "DETAILS" ? handleBack : undefined}
      >
        {selectedCustomer && (
          <Box>
            {stage === "DETAILS" && (
              <DetailsView 
                customer={selectedCustomer} 
                onInvoices={() => setStage("INVOICES")} 
                onAgent={() => setStage("AGENT")} 
              />
            )}
            {stage === "INVOICES" && (
              <InvoicesView 
                customerId={selectedCustomer.customerId} 
                onSelectInvoice={(inv) => {
                  setSelectedInvoice(inv);
                  setStage("TRACKS");
                }}
              />
            )}
            {stage === "AGENT" && (
              <AgentView customerId={selectedCustomer.customerId} />
            )}
            {stage === "TRACKS" && selectedInvoice && (
              <TracksStageView invoiceId={selectedInvoice.invoiceId} />
            )}
          </Box>
        )}
      </AdaptiveDialog>
    </VStack>
  );
};

// --- Sub-components for clean structure ---

const DetailsView = ({ customer, onInvoices, onAgent }: { 
  customer: Customer, onInvoices: () => void, onAgent: () => void 
}) => (
  <VStack align="stretch" gap={6}>
    <EntityDetailGrid 
      fields={[
        { label: "First Name", value: customer.firstName },
        { label: "Last Name", value: customer.lastName },
        { label: "Email", value: customer.email, fullWidth: true },
        { label: "Company", value: customer.company, fullWidth: true },
        { label: "City", value: customer.city },
        { label: "Country", value: customer.country },
      ]} 
    />
    <Separator />
    <Stack direction={{ base: "column", sm: "row" }} gap={3}>
      <Button colorPalette="brand" w="full" onClick={onInvoices}>
        <LuFileText /> Invoices List
      </Button>
      <Button variant="outline" w="full" onClick={onAgent}>
        <LuCircleUser /> Manager Info
      </Button>
    </Stack>
  </VStack>
);

const InvoicesView = ({ customerId, onSelectInvoice }: { 
  customerId: number, onSelectInvoice: (inv: Invoice) => void 
}) => {
  const { data, isLoading, isError, refetch } = useCustomerInvoices(customerId);
  
  return (
    <DataStateWrapper 
      isLoading={isLoading} 
      isError={isError} 
      isEmpty={data?.length === 0}
      onRetry={refetch}
    >
      <AppTable 
        data={data || []}
        keyExtractor={(inv) => inv.invoiceId}
        columns={[
          { header: "ID", accessor: "invoiceId", isPriority: true },
          { header: "Date", accessor: (inv) => new Date(inv.invoiceDate).toLocaleDateString() },
          { header: "Total", accessor: (inv) => `$${Number(inv.total).toFixed(2)}`, isPriority: true },
          { 
            header: "", 
            accessor: (inv) => (
              <Button size="xs" variant="ghost" onClick={() => onSelectInvoice(inv)}>
                Details <LuChevronRight />
              </Button>
            ) 
          }
        ]}
      />
    </DataStateWrapper>
  );
};

const AgentView = ({ customerId }: { customerId: number }) => {
  const { data, isLoading, isError, refetch } = useCustomerAgent(customerId);
  
  const fields = [
    { label: "First Name", value: data?.firstName },
    { label: "Last Name", value: data?.lastName },
    { label: "Email", value: data?.email, fullWidth: true },
    { label: "Title", value: data?.title, fullWidth: true },
    { label: "Birth Date", value: data?.birthDate ? new Date(data.birthDate).toLocaleDateString() : null },
    { label: "Hire Date", value: data?.hireDate ? new Date(data.hireDate).toLocaleDateString() : null },
    { label: "City", value: data?.city },
  ];

  return (
    <DataStateWrapper isLoading={isLoading} isError={isError} onRetry={refetch}>
      <EntityDetailGrid fields={fields} />
    </DataStateWrapper>
  );
};

const TracksStageView = ({ invoiceId }: { invoiceId: number }) => {
  const { data, isLoading, isError, refetch } = useTracks("invoice", invoiceId);
  
  return (
    <TrackListTable 
      tracks={data}
      isLoading={isLoading}
      isError={isError}
      onRetry={refetch}
    />
  );
};