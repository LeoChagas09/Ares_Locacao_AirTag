/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/locacoes/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Autocomplete, 
  TextField, 
  CircularProgress, 
  Paper,
  Avatar,
  Stack,
  Container,
  alpha,
  Fade,
  Chip,
  Divider,
  Snackbar,
  Alert,
  Tooltip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Pagination
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import DevicesIcon from '@mui/icons-material/Devices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

// Tipos
import { ILocacao } from '@/types/Locacao';
import { ICliente } from '@/types/Cliente';
import { IDispositivo } from '@/types/Dispositivo';

// Serviços
import locacaoService from '@/services/api/locacaoService';
import clienteService from '@/services/api/clienteService';
import dispositivoService from '@/services/api/dispositivoService';

// Componente do Modal de Nova Locação
function NovaLocacaoModal({ open, onClose, clientes, dispositivos, onSubmit }: any) {
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [dispositivoId, setDispositivoId] = useState<string | null>(null);

  const handleSubmit = () => {
    if (clienteId && dispositivoId) {
      onSubmit({ clienteId, dispositivoId });
      setClienteId(null);
      setDispositivoId(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'visible',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          p: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="3" cy="3" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          },
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <AddIcon sx={{ fontSize: '2rem', color: 'white' }} />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              Nova Locação
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Selecione o cliente e dispositivo para iniciar uma nova locação
            </Typography>
          </Box>
        </Stack>
      </Box>
      <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
        <Stack spacing={4}>
          {/* Card do Cliente */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: clienteId ? '#2563eb' : '#e2e8f0',
              borderRadius: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                borderColor: '#2563eb',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: '#2563eb', width: 32, height: 32 }}>
                <PersonIcon sx={{ fontSize: '1.25rem' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color="#2563eb">
                Selecionar Cliente
              </Typography>
            </Stack>
            <Autocomplete
              options={clientes}
              getOptionLabel={(option: ICliente) => option.nome}
              onChange={(event, newValue) => setClienteId(newValue?.id_cliente || null)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Digite para buscar um cliente..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563eb',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#2563eb',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps} sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#2563eb' }}>
                        <PersonIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {option.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {option.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                );
              }}
            />
          </Paper>

          {/* Card do Dispositivo */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid',
              borderColor: dispositivoId ? '#10b981' : '#e2e8f0',
              borderRadius: 3,
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                borderColor: '#10b981',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.1)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: '#10b981', width: 32, height: 32 }}>
                <DevicesIcon sx={{ fontSize: '1.25rem' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color="#10b981">
                Selecionar Dispositivo
              </Typography>
              <Chip
                label={`${dispositivos.length} disponíveis`}
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                }}
              />
            </Stack>
            <Autocomplete
              options={dispositivos}
              getOptionLabel={(option: IDispositivo) => `${option.nome} (${option.macAddress})`}
              onChange={(event, newValue) => setDispositivoId(newValue?.id_dispositivo || null)}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  placeholder="Digite para buscar um dispositivo..."
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: 'white',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#10b981',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              )}
              renderOption={(props, option) => {
                const { key, ...otherProps } = props;
                return (
                  <Box component="li" key={key} {...otherProps} sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: '#10b981' }}>
                        <DevicesIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {option.nome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                          {option.macAddress}
                        </Typography>
                      </Box>
                      <Chip
                        label="Disponível"
                        size="small"
                        sx={{
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          color: '#10b981',
                          fontSize: '0.75rem',
                        }}
                      />
                    </Stack>
                  </Box>
                );
              }}
            />
          </Paper>

          {/* Card de Informações de Cobrança */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '2px solid #f59e0b',
              borderRadius: 3,
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
              },
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: '#f59e0b', width: 32, height: 32 }}>
                <AttachMoneyIcon sx={{ fontSize: '1.25rem' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={600} color="#f59e0b">
                Informações de Cobrança
              </Typography>
            </Stack>
            
            <Box
              sx={{
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: 2,
                p: 3,
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                
                <Typography variant="h5" fontWeight={700} color="#f59e0b">
                  R$ 0,52
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  por minuto de utilização
                </Typography>
              </Stack>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                textAlign="center" 
                sx={{ mt: 2, fontStyle: 'italic' }}
              >
                A cobrança será calculada automaticamente ao finalizar a locação
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 4, pt: 2, bgcolor: '#f8fafc' }}>
        <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{
              flex: 1,
              py: 1.5,
              borderRadius: 2,
              borderColor: '#6b7280',
              color: '#6b7280',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: '#374151',
                bgcolor: 'rgba(107, 114, 128, 0.05)',
              },
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={!clienteId || !dispositivoId}
            startIcon={<PlayArrowIcon />}
            sx={{
              flex: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: '#10b981',
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                bgcolor: '#059669',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:disabled': {
                bgcolor: '#d1d5db',
                color: '#9ca3af',
                boxShadow: 'none',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {!clienteId || !dispositivoId 
              ? 'Selecione Cliente e Dispositivo'
              : 'Iniciar Locação'
            }
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default function LocacoesPage() {
  const [locacoes, setLocacoes] = useState<ILocacao[]>([]);
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [dispositivos, setDispositivos] = useState<IDispositivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para Snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });
  
  // Estados para modal de confirmação
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [locacaoToFinalize, setLocacaoToFinalize] = useState<ILocacao | null>(null);
  
  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<'todas' | 'ativas' | 'finalizadas'>('todas');
  const itemsPerPage = 6;

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locacoesData, clientesData, dispositivosData] = await Promise.all([
        locacaoService.getAll(),
        clienteService.getAll(),
        dispositivoService.getAll(),
      ]);
      setLocacoes(locacoesData);
      setClientes(clientesData);
      setDispositivos(dispositivosData);
    } catch (err) {
      showSnackbar('Falha ao carregar dados. Tente novamente mais tarde.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { locacoesAtivas, locacoesFinalizadas, dispositivosDisponiveis, locacoesFiltradas, totalPages, valorTotalTodas, valorTotalFinalizadas } = useMemo(() => {
    const ativas = locacoes.filter(l => l.dataFim === null);
    const finalizadas = locacoes.filter(l => l.dataFim !== null);
    
    const dispositivosAlugadosIds = new Set(ativas.map(l => l.dispositivoId));
    const disponiveis = dispositivos.filter(d => !dispositivosAlugadosIds.has(d.id_dispositivo));
    
    // Cálculo dos valores totais
    const valorFinalizadas = finalizadas.reduce((total, locacao) => total + (locacao.custoTotal || 0), 0);
    const valorTodas = valorFinalizadas; // Apenas locacoes finalizadas tem custo calculado
    
    // Filtrar locações baseado no filtro atual
    let filtradas: ILocacao[] = [];
    if (filter === 'ativas') {
      filtradas = ativas;
    } else if (filter === 'finalizadas') {
      filtradas = finalizadas;
    } else {
      filtradas = [...ativas, ...finalizadas];
    }
    
    // Paginação
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtradas.slice(startIndex, endIndex);
    const totalPgs = Math.ceil(filtradas.length / itemsPerPage);

    return { 
      locacoesAtivas: ativas, 
      locacoesFinalizadas: finalizadas, 
      dispositivosDisponiveis: disponiveis,
      locacoesFiltradas: paginatedData,
      totalPages: totalPgs,
      valorTotalTodas: valorTodas,
      valorTotalFinalizadas: valorFinalizadas
    };
  }, [locacoes, dispositivos, filter, currentPage]);

  const handleFinalizar = (locacao: ILocacao) => {
    setLocacaoToFinalize(locacao);
    setConfirmModalOpen(true);
  };
  
  const confirmFinalizar = async () => {
    if (!locacaoToFinalize) return;
    
    try {
      await locacaoService.finalizar(locacaoToFinalize.id_locacao);
      showSnackbar('Locação finalizada com sucesso!', 'success');
      fetchData();
    } catch (err) {
      showSnackbar('Falha ao finalizar locação.', 'error');
    } finally {
      setConfirmModalOpen(false);
      setLocacaoToFinalize(null);
    }
  };
  
  const renderLocacaoCard = (locacao: ILocacao) => {
    const isAtiva = !locacao.dataFim;
    const dataFormatada = new Date(locacao.dataInicio).toLocaleString('pt-BR');
    const dataFimFormatada = locacao.dataFim ? new Date(locacao.dataFim).toLocaleString('pt-BR') : null;
    
    return (
      <Card
        key={locacao.id_locacao}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid',
          borderColor: isAtiva ? 'warning.main' : 'success.main',
          borderRadius: 3,
          transition: 'all 0.3s ease-in-out',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: isAtiva 
              ? '0 8px 25px rgba(245, 158, 11, 0.15)' 
              : '0 8px 25px rgba(16, 185, 129, 0.15)',
            borderColor: isAtiva ? 'warning.main' : 'success.main',
          },
        }}
      >
        {/* Status Badge */}
        <Chip
          label={isAtiva ? 'ATIVA' : 'FINALIZADA'}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: isAtiva ? 'warning.main' : 'success.main',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            zIndex: 1,
          }}
        />
        
        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          {/* Cliente */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: alpha('#2563eb', 0.1), 
                color: 'primary.main',
                width: 40,
                height: 40
              }}
            >
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                {locacao.cliente?.nome || 'Cliente não encontrado'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locacao.cliente?.email || 'Email não disponível'}
              </Typography>
            </Box>
          </Stack>
          
          {/* Dispositivo */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Avatar 
              sx={{ 
                bgcolor: alpha('#10b981', 0.1), 
                color: 'success.main',
                width: 40,
                height: 40
              }}
            >
              <DevicesIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                {locacao.dispositivo?.nome || 'Dispositivo não encontrado'}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontFamily="monospace">
                {locacao.dispositivo?.macAddress || 'MAC não disponível'}
              </Typography>
            </Box>
          </Stack>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Informações da Locação */}
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Início:
              </Typography>
              <Chip
                label={dataFormatada}
                size="small"
                sx={{
                  bgcolor: alpha('#f59e0b', 0.1),
                  color: 'warning.main',
                  fontFamily: 'monospace',
                  fontSize: '0.75rem',
                }}
              />
            </Stack>
            
            {dataFimFormatada && (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Término:
                </Typography>
                <Chip
                  label={dataFimFormatada}
                  size="small"
                  sx={{
                    bgcolor: alpha('#10b981', 0.1),
                    color: 'success.main',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                  }}
                />
              </Stack>
            )}
            
            {locacao.custoTotal && (
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Custo Total:
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    R$ {locacao.custoTotal.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </CardContent>
        
        {isAtiva && (
          <CardActions sx={{ p: 3, pt: 0 }}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleFinalizar(locacao)}
              sx={{
                color: 'white',
                fontWeight: 600,
                py: 1.2,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              Finalizar Locação
            </Button>
          </CardActions>
        )}
      </Card>
    );
  };
  
  const handleFormSubmit = async (data: { clienteId: string; dispositivoId: string }) => {
    try {
      await locacaoService.iniciar(data);
      setIsModalOpen(false);
      showSnackbar('Locação iniciada com sucesso!', 'success');
      fetchData();
    } catch (err: any) {
      showSnackbar(err.message || 'Falha ao iniciar locação.', 'error');
    }
  };



  if (loading) return (
    <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
      <CircularProgress 
        size={60} 
        sx={{ 
          color: 'warning.main',
          mb: 3
        }} 
      />
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
        Carregando dados das locações...
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', opacity: 0.7 }}>
        Aguarde enquanto sincronizamos as informações
      </Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in={true} timeout={600}>
        <Box>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              mb: 4, 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Sistema de Locações
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  Gerencie locações ativas e mantenha histórico completo
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
                    border: '2px solid rgba(255,255,255,0.3)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Nova Locação
              </Button>
            </Stack>
          </Paper>

          {/* Filtros */}
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              mb: 4, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h6" fontWeight={600}>
                Filtrar por:
              </Typography>
              <Button
                variant={filter === 'todas' ? 'contained' : 'outlined'}
                onClick={() => {
                  setFilter('todas');
                  setCurrentPage(1);
                }}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  ...(filter === 'todas' ? {
                    bgcolor: '#6366f1',
                    '&:hover': { bgcolor: '#4f46e5' }
                  } : {
                    borderColor: '#6366f1',
                    color: '#6366f1',
                    '&:hover': { 
                      bgcolor: 'rgba(99, 102, 241, 0.08)',
                      borderColor: '#4f46e5'
                    }
                  })
                }}
              >
                Todas ({locacoesAtivas.length + locacoesFinalizadas.length})
              </Button>
              <Button
                variant={filter === 'ativas' ? 'contained' : 'outlined'}
                onClick={() => {
                  setFilter('ativas');
                  setCurrentPage(1);
                }}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  ...(filter === 'ativas' ? {
                    bgcolor: '#f59e0b',
                    '&:hover': { bgcolor: '#d97706' }
                  } : {
                    borderColor: '#f59e0b',
                    color: '#f59e0b',
                    '&:hover': { 
                      bgcolor: 'rgba(245, 158, 11, 0.08)',
                      borderColor: '#d97706'
                    }
                  })
                }}
              >
                Ativas ({locacoesAtivas.length})
              </Button>
              <Button
                variant={filter === 'finalizadas' ? 'contained' : 'outlined'}
                onClick={() => {
                  setFilter('finalizadas');
                  setCurrentPage(1);
                }}
                sx={{ 
                  textTransform: 'none',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  ...(filter === 'finalizadas' ? {
                    bgcolor: '#10b981',
                    '&:hover': { bgcolor: '#059669' }
                  } : {
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { 
                      bgcolor: 'rgba(16, 185, 129, 0.08)',
                      borderColor: '#059669'
                    }
                  })
                }}
              >
                Finalizadas ({locacoesFinalizadas.length})
              </Button>
            </Stack>
          </Paper>

          {/* Cards de Locações */}
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
              mb: 4
            }}
          >
            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ 
                  bgcolor: filter === 'ativas' ? 'warning.main' : 
                           filter === 'finalizadas' ? 'success.main' : 'primary.main' 
                }}>
                  {filter === 'ativas' ? <PlayArrowIcon /> : 
                   filter === 'finalizadas' ? <HistoryIcon /> : <AssignmentIcon />}
                </Avatar>
                <Typography variant="h5" fontWeight={600}>
                  {filter === 'ativas' ? 'Locações Ativas' : 
                   filter === 'finalizadas' ? 'Locações Finalizadas' : 'Todas as Locações'}
                </Typography>
                <Chip 
                  label={`${locacoesFiltradas.length} ${locacoesFiltradas.length === 1 ? 'item' : 'itens'}`}
                  size="small"
                  sx={{ ml: 'auto' }}
                />
                {(filter === 'todas' || filter === 'finalizadas') && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ 
                    bgcolor: filter === 'finalizadas' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: filter === 'finalizadas' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)'
                  }}>
                    <AttachMoneyIcon sx={{ 
                      color: filter === 'finalizadas' ? '#10b981' : '#6366f1',
                      fontSize: '1.1rem' 
                    }} />
                    <Typography 
                      variant="h6" 
                      fontWeight={700} 
                      color={filter === 'finalizadas' ? '#10b981' : '#6366f1'}
                    >
                      R$ {filter === 'finalizadas' ? valorTotalFinalizadas.toFixed(2) : valorTotalTodas.toFixed(2)}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            
            <Box sx={{ p: 3 }}>
              {locacoesFiltradas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: 'grey.100',
                      color: 'grey.400',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <AssignmentIcon sx={{ fontSize: '2rem' }} />
                  </Avatar>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Nenhuma locação encontrada
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {filter === 'ativas' ? 'Não há locações ativas no momento' :
                     filter === 'finalizadas' ? 'Não há locações finalizadas ainda' :
                     'Não há locações cadastradas no sistema'}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                      },
                      gap: 3,
                      mb: 4,
                    }}
                  >
                    {locacoesFiltradas.map((locacao) => renderLocacaoCard(locacao))}
                  </Box>

                  {totalPages > 1 && (
                    <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => setCurrentPage(page)}
                        color={filter === 'ativas' ? 'primary' : 'primary'}
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          '& .MuiPaginationItem-root': {
                            fontWeight: 600,
                          },
                        }}
                      />
                    </Stack>
                  )}
                </>
              )}
            </Box>
          </Paper>

          {/* Modal de Nova Locação */}
          <NovaLocacaoModal 
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            clientes={clientes}
            dispositivos={dispositivosDisponiveis}
            onSubmit={handleFormSubmit}
          />
          
          {/* Modal de Confirmação para Finalizar */}
          <Dialog 
            open={confirmModalOpen} 
            onClose={() => setConfirmModalOpen(false)}
            maxWidth="xs"
            fullWidth
          >
            <DialogTitle sx={{ pb: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <WarningIcon />
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  Confirmar Finalização
                </Typography>
              </Stack>
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Tem certeza que deseja finalizar a locação de{' '}
                <strong>{locacaoToFinalize?.dispositivo?.nome}</strong> para{' '}
                <strong>{locacaoToFinalize?.cliente?.nome}</strong>?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Esta ação não poderá ser desfeita.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button 
                onClick={() => setConfirmModalOpen(false)} 
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmFinalizar} 
                variant="contained" 
                color="warning"
                startIcon={<CheckCircleIcon />}
                sx={{
                color: 'white',
                }}
                
              >
                Finalizar Locação
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Snackbar para notificações */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
              severity={snackbar.severity}
              variant="filled"
              sx={{ 
                width: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
              action={
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
}