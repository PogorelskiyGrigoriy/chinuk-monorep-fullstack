/**
 * @module CustomersPage
 * Основная страница управления клиентами (ТЗ 1.1).
 * Реализует многоуровневую навигацию "Table-to-Drawer".
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
  // 1. Состояние данных (setParams убран для чистоты линтера, пока нет переключения страниц)
  const [params] = useState({ page: 1, limit: 10 });
  const { data: customers, isLoading, isError, refetch } = useCustomers(params);

  // 2. Управление состоянием диалога
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [stage, setStage] = useState<DrawerStage>("DETAILS");

  // 3. Конфигурация колонок (ТЗ 1.1.1.1)
  const columns: AppTableColumn<Customer>[] = [
    { header: "Имя", accessor: "firstName", isPriority: true },
    { header: "Фамилия", accessor: "lastName", isPriority: true },
    { header: "Город", accessor: "city" },
    { header: "Страна", accessor: "country" },
    { header: "Email", accessor: "email" },
    {
      header: "Действия",
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

  // 4. Логика переходов
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
      case "DETAILS": return "Информация о клиенте";
      case "INVOICES": return "Счета клиента";
      case "AGENT": return "Менеджер поддержки";
      case "TRACKS": return `Треки счета #${selectedInvoice?.invoiceId}`;
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
          isEmpty={customers?.length === 0}
          onRetry={refetch}
        >
          <AppTable 
            data={customers || []} 
            columns={columns} 
            keyExtractor={(c) => c.customerId}
            onDetailClick={(c) => handleOpenStage(c, "DETAILS")}
          />
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

// --- Вспомогательные компоненты для чистой структуры ---

/** ЭКРАН 1: Детальная информация */
const DetailsView = ({ customer, onInvoices, onAgent }: { 
  customer: Customer, onInvoices: () => void, onAgent: () => void 
}) => (
  <VStack align="stretch" gap={6}>
    <EntityDetailGrid 
      fields={[
        { label: "Имя", value: customer.firstName },
        { label: "Фамилия", value: customer.lastName },
        { label: "Email", value: customer.email, fullWidth: true },
        { label: "Компания", value: customer.company, fullWidth: true },
        { label: "Город", value: customer.city },
        { label: "Страна", value: customer.country },
      ]} 
    />
    <Separator />
    <Stack direction={{ base: "column", sm: "row" }} gap={3}>
      <Button colorPalette="brand" w="full" onClick={onInvoices}>
        <LuFileText /> Список счетов
      </Button>
      <Button variant="outline" w="full" onClick={onAgent}>
        <LuCircleUser /> Менеджер
      </Button>
    </Stack>
  </VStack>
);

/** ЭКРАН 2: Список инвойсов */
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
          { header: "Дата", accessor: (inv) => new Date(inv.invoiceDate).toLocaleDateString() },
          { header: "Сумма", accessor: (inv) => `$${inv.total.toFixed(2)}`, isPriority: true },
          { 
            header: "", 
            accessor: (inv) => (
              <Button size="xs" variant="ghost" onClick={() => onSelectInvoice(inv)}>
                Детали <LuChevronRight />
              </Button>
            ) 
          }
        ]}
      />
    </DataStateWrapper>
  );
};

/** ЭКРАН 3: Карточка агента */
const AgentView = ({ customerId }: { customerId: number }) => {
  const { data, isLoading, isError, refetch } = useCustomerAgent(customerId);
  
  const fields = [
    { label: "Имя", value: data?.firstName },
    { label: "Фамилия", value: data?.lastName },
    { label: "Email", value: data?.email, fullWidth: true },
    { label: "Должность", value: data?.title, fullWidth: true },
    { label: "Дата рождения", value: data?.birthDate ? new Date(data.birthDate).toLocaleDateString() : null },
    { label: "Дата найма", value: data?.hireDate ? new Date(data.hireDate).toLocaleDateString() : null },
    { label: "Город", value: data?.city },
  ];

  return (
    <DataStateWrapper isLoading={isLoading} isError={isError} onRetry={refetch}>
      <EntityDetailGrid fields={fields} />
    </DataStateWrapper>
  );
};

/** ЭКРАН 4: Список треков (вынесен в компонент из-за хуков) */
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