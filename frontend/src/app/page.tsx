// src/app/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardActions,
  Paper,
  alpha,
  Stack,
  Avatar,
  Divider,
  Skeleton
} from "@mui/material";
import NextLink from "next/link";
import { 
  People, 
  Devices, 
  Assignment, 
  TrendingUp,
  Add,
  Visibility,
  Dashboard
} from "@mui/icons-material";

// Importar os serviços
import clienteService from '@/services/api/clienteService';
import dispositivoService from '@/services/api/dispositivoService';
import locacaoService from '@/services/api/locacaoService';

// Tipos
import { ICliente } from '@/types/Cliente';
import { IDispositivo } from '@/types/Dispositivo';
import { ILocacao } from '@/types/Locacao';

interface DashboardData {
  clientes: ICliente[];
  dispositivos: IDispositivo[];
  locacoes: ILocacao[];
}

export default function HomePage() {
  const [data, setData] = useState<DashboardData>({
    clientes: [],
    dispositivos: [],
    locacoes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados do backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [clientesData, dispositivosData, locacoesData] = await Promise.all([
        clienteService.getAll(),
        dispositivoService.getAll(),
        locacaoService.getAll(),
      ]);

      setData({
        clientes: clientesData,
        dispositivos: dispositivosData,
        locacoes: locacoesData
      });
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Falha ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calcular estatísticas
  const stats = {
    totalClientes: data.clientes.length,
    totalDispositivos: data.dispositivos.length,
    locacoesAtivas: data.locacoes.filter(l => l.dataFim === null).length,
    locacoesFinalizadas: data.locacoes.filter(l => l.dataFim !== null).length,
    receita: data.locacoes
      .filter(l => l.dataFim !== null && l.custoTotal)
      .reduce((acc, l) => acc + (l.custoTotal || 0), 0)
  };

  const moduleStats = [
    {
      title: "Clientes",
      icon: People,
      count: stats.totalClientes.toString(),
      description: "Clientes cadastrados",
      color: "#2563eb",
      gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
      path: "/clientes",
      actions: [
        { label: "Ver Todos", icon: Visibility, path: "/clientes" },
        { label: "Novo Cliente", icon: Add, path: "/clientes" }
      ]
    },
    {
      title: "Dispositivos",
      icon: Devices,
      count: stats.totalDispositivos.toString(),
      description: "Dispositivos disponíveis",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      path: "/dispositivos",
      actions: [
        { label: "Ver Todos", icon: Visibility, path: "/dispositivos" },
        { label: "Novo Dispositivo", icon: Add, path: "/dispositivos" }
      ]
    },
    {
      title: "Locações",
      icon: Assignment,
      count: stats.locacoesAtivas.toString(),
      description: "Locações ativas",
      color: "#f59e0b",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      path: "/locacoes",
      actions: [
        { label: "Ver Todas", icon: Visibility, path: "/locacoes" },
        { label: "Nova Locação", icon: Add, path: "/locacoes" }
      ]
    }
  ];

  const quickStats = [
    { 
      label: "Total de Clientes", 
      value: stats.totalClientes.toString(), 
      change: `${stats.totalClientes > 0 ? '+' : ''}${stats.totalClientes} cadastrados`, 
      positive: true 
    },
    { 
      label: "Dispositivos Ativos", 
      value: stats.totalDispositivos.toString(), 
      change: `${stats.totalDispositivos} disponíveis`, 
      positive: true 
    },
    { 
      label: "Locações Ativas", 
      value: stats.locacoesAtivas.toString(), 
      change: `${stats.locacoesFinalizadas} finalizadas`, 
      positive: true 
    },
    { 
      label: "Receita Total", 
      value: `R$ ${stats.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      change: `${stats.locacoesFinalizadas} transações`, 
      positive: true 
    },
  ];

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchDashboardData}>
          Tentar Novamente
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 72px)', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: alpha('#ffffff', 0.2),
              }}
            >
              <Dashboard sx={{ fontSize: '2rem' }} />
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Visão geral do sistema de gestão IN HOUSE
                {loading && ' - Atualizando dados...'}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4 }}>
          {quickStats.map((stat, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 3,
                flex: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 2,
                },
              }}
            >
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto' }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mx: 'auto', mt: 1 }} />
                  <Skeleton variant="text" width="70%" height={16} sx={{ mx: 'auto', mt: 1 }} />
                </>
              ) : (
                <>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, mb: 1 }}>
                    {stat.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: stat.positive ? 'success.main' : 'error.main',
                      fontSize: '0.75rem'
                    }}
                  >
                    {stat.change}
                  </Typography>
                </>
              )}
            </Paper>
          ))}
        </Box>

        {/* Modules Cards */}
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Módulos do Sistema
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {moduleStats.map((module, index) => {
            const IconComponent = module.icon;
            return (
              <Card
                key={index}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                {/* Card Header */}
                <Box
                  sx={{
                    background: module.gradient,
                    color: 'white',
                    p: 3,
                    textAlign: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha('#ffffff', 0.2),
                      mx: 'auto',
                      mb: 2,
                      width: 56,
                      height: 56,
                    }}
                  >
                    <IconComponent sx={{ fontSize: '1.75rem' }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    {module.title}
                  </Typography>
                  {loading ? (
                    <Skeleton variant="text" width="50%" height={48} sx={{ mx: 'auto', bgcolor: 'rgba(255,255,255,0.2)' }} />
                  ) : (
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                      {module.count}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {module.description}
                  </Typography>
                </Box>

                {/* Card Content */}
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <TrendingUp sx={{ color: 'success.main', fontSize: '1.25rem' }} />
                        <Typography variant="body2" color="success.main" fontWeight={600}>
                          {loading ? 'Carregando...' : 'Dados atualizados'}
                        </Typography>
                      </Stack>
                    </Box>
                    
                    <Divider />
                    
                    {/* Quick Actions */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, textAlign: 'center' }}>
                      Ações Rápidas
                    </Typography>
                  </Stack>
                </CardContent>

                {/* Card Actions */}
                <CardActions sx={{ p: 3, pt: 0, flexDirection: 'column', gap: 1 }}>
                  {module.actions.map((action, actionIndex) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={actionIndex}
                        variant={actionIndex === 0 ? "outlined" : "contained"}
                        component={NextLink}
                        href={action.path}
                        startIcon={<ActionIcon />}
                        fullWidth
                        disabled={loading}
                        sx={{
                          py: 1.5,
                          ...(actionIndex === 1 && {
                            background: module.gradient,
                            '&:hover': {
                              background: module.gradient,
                              opacity: 0.9,
                            },
                          }),
                          ...(actionIndex === 0 && {
                            borderColor: module.color,
                            color: module.color,
                            '&:hover': {
                              borderColor: module.color,
                              backgroundColor: alpha(module.color, 0.08),
                            },
                          }),
                        }}
                      >
                        {action.label}
                      </Button>
                    );
                  })}
                </CardActions>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}