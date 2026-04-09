/**
 * @module AuditPage
 * Теперь использует единый тип данных из Shared.
 */
import { useState } from "react";
import { Heading, VStack, Text, Code, Box } from "@chakra-ui/react";
import { AppPanel } from "@/components/shared/atoms/AppPanel";
import { DataStateWrapper } from "@/components/shared/organisms/DataStateWrapper";
import { AppTable, type AppTableColumn } from "@/components/shared/organisms/AppTable";
import { AppBadge } from "@/components/shared/atoms/AppBadge";
import { useAuditLogs } from "@/services/hooks/queries/use-audit";

// ИМПОРТ: Берем готовый тип из shared
import { type AuditLog } from "@project/shared"; 

export const AuditPage = () => {
  const [params] = useState({ page: 1, limit: 20 });
  
  // Если хук useAuditLogs типизирован правильно (возвращает AuditLog[]),
  // то переменная 'data' автоматически получит нужный тип.
  const { data, isLoading, isError, refetch } = useAuditLogs(params);

  const columns: AppTableColumn<AuditLog>[] = [
    { 
      header: "Время", 
      accessor: (log) => new Date(log.timestamp).toLocaleString(),
      isPriority: true 
    },
    { header: "Сотрудник", accessor: "email", isPriority: true },
    { 
      header: "Действие", 
      accessor: (log) => (
        <AppBadge 
          value={log.action} 
          colorPalette={
            log.action === "AUTH_LOGIN" ? "green" : 
            log.action === "DATA_READ" ? "blue" : 
            log.action === "ACCESS_DENIED" ? "red" : "orange"
          }
        />
      ) 
    },
    { 
      header: "Ресурс", 
      accessor: (log) => log.resource ? <Code fontSize="10px">{log.resource}</Code> : "—" 
    },
    { 
      header: "IP / Устройство", 
      accessor: (log) => (
        <Box fontSize="xs" color="fg.muted">
          <Text lineClamp={1}>IP: {(log.metadata?.ip as string) || "unknown"}</Text>
          <Text lineClamp={1} fontSize="10px">{(log.metadata?.userAgent as string) || "no-agent"}</Text>
        </Box>
      ) 
    },
  ];

  return (
    <VStack gap={6} align="stretch" w="full">
      <Heading size="xl" fontWeight="black" letterSpacing="tight">SYSTEM AUDIT</Heading>

      <AppPanel>
        <DataStateWrapper 
          isLoading={isLoading} 
          isError={isError} 
          isEmpty={data?.length === 0}
          onRetry={refetch}
        >
          {/* ИСПРАВЛЕНО: Больше не нужен грязный каст 'as unknown as AuditLog[]' */}
          <AppTable 
            data={data || []} 
            columns={columns} 
            keyExtractor={(log) => log.id}
          />
        </DataStateWrapper>
      </AppPanel>
    </VStack>
  );
};