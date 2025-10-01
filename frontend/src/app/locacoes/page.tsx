/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/locacoes/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Avatar,
  Stack,
  Divider,
  Modal,
  Paper,
  TextField,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
  InputAdornment,
  Tooltip,
  IconButton,
  Fade,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import DevicesIcon from '@mui/icons-material/Devices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

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
      fullScreen={typeof window !== 'undefined' && window.innerWidth < 600} // Full screen em mobile
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 }, // Sem border radius em mobile
          overflow: 'visible',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxHeight: { xs: '100vh', sm: '90vh' }, // Altura máxima responsiva
          margin: { xs: 0, sm: 'auto' }
        }
      }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          p: { xs: 2, sm: 3, md: 4 }, // Padding responsivo
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
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 2, sm: 3 }} 
          alignItems={{ xs: 'center', sm: 'center' }}
          textAlign={{ xs: 'center', sm: 'left' }}
        >
          <Avatar 
            sx={{ 
              width: { xs: 48, sm: 56, md: 64 }, 
              height: { xs: 48, sm: 56, md: 64 }, 
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            <AddIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, color: 'white' }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              sx={{ 
                mb: 1,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
              }}
            >
              Nova Locação
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Selecione o cliente e dispositivo para iniciar uma nova locação
            </Typography>
          </Box>
        </Stack>
      </Box>
      <DialogContent sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#f8fafc' }}>
        <Stack spacing={{ xs: 3, sm: 4 }}>
          {/* Card do Cliente */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3 },
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
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              sx={{ mb: 2 }}
            >
              <Avatar sx={{ bgcolor: '#2563eb', width: 32, height: 32 }}>
                <PersonIcon sx={{ fontSize: '1.25rem' }} />
              </Avatar>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                color="#2563eb"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
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
              p: { xs: 2, sm: 3 },
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
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              sx={{ mb: 2 }}
              flexWrap="wrap"
            >
              <Avatar sx={{ bgcolor: '#10b981', width: 32, height: 32 }}>
                <DevicesIcon sx={{ fontSize: '1.25rem' }} />
              </Avatar>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                color="#10b981"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Selecionar Dispositivo
              </Typography>
              <Chip
                label={`${dispositivos.length} disponíveis`}
                size="small"
                sx={{
                  bgcolor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10b981',
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
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
              p: { xs: 2, sm: 3 },
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
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              alignItems={{ xs: 'flex-start', sm: 'center' }} 
              sx={{ mb: 2 }}
            >
              <Avatar sx={{ bgcolor: '#f59e0b', width: 32, height: 32 }}>
                <AttachMoneyIcon sx={{ fontSize: '1.25rem' }} />
              </Avatar>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                color="#f59e0b"
                sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
              >
                Informações de Cobrança
              </Typography>
            </Stack>
            
            <Box
              sx={{
                bgcolor: 'rgba(245, 158, 11, 0.1)',
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                border: '1px solid rgba(245, 158, 11, 0.2)',
              }}
            >
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                alignItems="center" 
                justifyContent="center"
                textAlign="center"
              >
                <Typography 
                  variant="h5" 
                  fontWeight={700} 
                  color="#f59e0b"
                  sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}
                >
                  R$ 0,52
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  por minuto de utilização
                </Typography>
              </Stack>
              
              <Typography 
                variant="body2" 
                color="text.secondary" 
                textAlign="center" 
                sx={{ 
                  mt: 2, 
                  fontStyle: 'italic',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                A cobrança será calculada automaticamente ao finalizar a locação
              </Typography>
            </Box>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: { xs: 2, sm: 3, md: 4 }, pt: 2, bgcolor: '#f8fafc' }}>
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          sx={{ width: '100%' }}
        >
          <Button 
            onClick={onClose} 
            variant="outlined"
            sx={{
              flex: { xs: 'none', sm: 1 },
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              borderColor: '#6b7280',
              color: '#6b7280',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
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
              flex: { xs: 'none', sm: 2 },
              py: { xs: 1.2, sm: 1.5 },
              borderRadius: 2,
              bgcolor: '#10b981',
              fontWeight: 600,
              textTransform: 'none',
              fontSize: { xs: '0.875rem', sm: '1rem' },
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
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset para primeira página quando buscar
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
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
    
    // Aplicar filtro de busca por texto
    if (searchTerm) {
      filtradas = filtradas.filter(locacao => 
        locacao.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locacao.cliente?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locacao.dispositivo?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locacao.dispositivo?.macAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
  }, [locacoes, dispositivos, filter, currentPage, searchTerm]);

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
          '@media (hover: hover)': {
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isAtiva 
                ? '0 8px 25px rgba(245, 158, 11, 0.15)' 
                : '0 8px 25px rgba(16, 185, 129, 0.15)',
            },
          },
        }}
      >
        {/* Header com Status Badge */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 3,
            pb: 0,
          }}
        >
          <Box sx={{ flex: 1 }} />
          <Tooltip 
            title={isAtiva ? 'Locação em andamento' : 'Locação concluída'} 
            arrow 
            placement="left"
            enterDelay={300}
          >
            <Chip
              label={isAtiva ? 'ATIVA' : 'FINALIZADA'}
              size="small"
              icon={isAtiva ? <PlayCircleOutlineIcon /> : <CheckCircleIcon />}
              sx={{
                bgcolor: isAtiva ? 'warning.main' : 'success.main',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.5px',
                px: 1.5,
                py: 0.25,
                borderRadius: 2,
                boxShadow: isAtiva 
                  ? '0 2px 8px rgba(245, 158, 11, 0.3)' 
                  : '0 2px 8px rgba(16, 185, 129, 0.3)',
                border: '2px solid white',
                '& .MuiChip-icon': {
                  fontSize: '1rem',
                  color: 'white',
                  ml: 0.5,
                },
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: isAtiva 
                    ? '0 4px 12px rgba(245, 158, 11, 0.4)' 
                    : '0 4px 12px rgba(16, 185, 129, 0.4)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            />
          </Tooltip>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, p: 3, pt: 2 }}>
          {/* Cliente */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#2563eb', 0.1), color: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Tooltip 
                title={locacao.cliente?.nome || 'Cliente não encontrado'} 
                arrow 
                placement="top"
                enterDelay={500}
              >
                <Typography variant="h6" fontWeight={600} noWrap sx={{ cursor: 'help' }}>
                  {locacao.cliente?.nome || 'Cliente não encontrado'}
                </Typography>
              </Tooltip>
              <Tooltip 
                title={locacao.cliente?.email || 'Email não disponível'} 
                arrow 
                placement="bottom"
                enterDelay={500}
              >
                <Typography variant="body2" color="text.secondary" noWrap sx={{ cursor: 'help' }}>
                  {locacao.cliente?.email || 'Email não disponível'}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          
          {/* Dispositivo */}
          <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: alpha('#10b981', 0.1), color: 'success.main' }}>
              <DevicesIcon />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Tooltip 
                title={locacao.dispositivo?.nome || 'Dispositivo não encontrado'} 
                arrow 
                placement="top"
                enterDelay={500}
              >
                <Typography variant="h6" fontWeight={600} noWrap sx={{ cursor: 'help' }}>
                  {locacao.dispositivo?.nome || 'Dispositivo não encontrado'}
                </Typography>
              </Tooltip>
              <Tooltip 
                title={`MAC Address: ${locacao.dispositivo?.macAddress || 'MAC não disponível'}`} 
                arrow 
                placement="bottom"
                enterDelay={500}
              >
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  fontFamily="monospace"
                  noWrap
                  sx={{ cursor: 'help' }}
                >
                  {locacao.dispositivo?.macAddress || 'MAC não disponível'}
                </Typography>
              </Tooltip>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* Informações da Locação */}
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Início:
              </Typography>
              <Tooltip 
                title={`Data de início: ${dataFormatada}`} 
                arrow 
                placement="left"
                enterDelay={300}
              >
                <Chip
                  label={dataFormatada}
                  size="small"
                  sx={{
                    bgcolor: alpha('#f59e0b', 0.1),
                    color: 'warning.main',
                    fontFamily: 'monospace',
                    cursor: 'help',
                  }}
                />
              </Tooltip>
            </Box>
            
            {dataFimFormatada && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Término:
                </Typography>
                <Tooltip 
                  title={`Data de término: ${dataFimFormatada}`} 
                  arrow 
                  placement="left"
                  enterDelay={300}
                >
                  <Chip
                    label={dataFimFormatada}
                    size="small"
                    sx={{
                      bgcolor: alpha('#10b981', 0.1),
                      color: 'success.main',
                      fontFamily: 'monospace',
                      cursor: 'help',
                    }}
                  />
                </Tooltip>
              </Box>
            )}
            
            {locacao.custoTotal && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Custo Total:
                </Typography>
                <Tooltip 
                  title={`Valor total da locação: R$ ${locacao.custoTotal.toFixed(2)}`} 
                  arrow 
                  placement="left"
                  enterDelay={300}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={600} 
                    color="success.main"
                    sx={{ cursor: 'help' }}
                  >
                    R$ {locacao.custoTotal.toFixed(2)}
                  </Typography>
                </Tooltip>
              </Box>
            )}
          </Stack>
        </CardContent>
        
        {isAtiva && (
          <CardActions sx={{ p: 3, pt: 0 }}>
            <Tooltip title="Clique para finalizar esta locação" arrow placement="top">
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
                  '@media (hover: hover)': {
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    },
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                Finalizar Locação
              </Button>
            </Tooltip>
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
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, textAlign: 'center' }}>
      <CircularProgress 
        size={60} 
        sx={{ 
          color: 'warning.main',
          mb: 3
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          mt: 2, 
          color: 'text.secondary',
          fontSize: { xs: '1.1rem', sm: '1.25rem' }
        }}
      >
        Carregando dados das locações...
      </Typography>
      <Typography 
        variant="body2" 
        sx={{ 
          mt: 1, 
          color: 'text.secondary', 
          opacity: 0.7,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}
      >
        Aguarde enquanto sincronizamos as informações
      </Typography>
    </Container>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Fade in={true} timeout={600}>
        <Box>
          {/* Header */}
          <Paper 
            elevation={0}
            sx={{ 
              p: { xs: 3, sm: 4 }, 
              mb: { xs: 3, sm: 4 }, 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              justifyContent="space-between" 
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={{ xs: 3, sm: 2 }}
            >
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, width: { xs: '100%', sm: 'auto' } }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' }
                  }}
                >
                  Sistema de Locações
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
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
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.2, sm: 1.5 },
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minWidth: { xs: '100%', sm: 200 },
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
              p: { xs: 2, sm: 3 }, 
              mb: { xs: 3, sm: 4 }, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3
            }}
          >
            <Stack spacing={{ xs: 2, sm: 3 }}>
              {/* Filtros por Status */}
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                alignItems={{ xs: 'flex-start', sm: 'center' }} 
                flexWrap="wrap" 
                useFlexGap
              >
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' },
                    mb: { xs: 1, sm: 0 }
                  }}
                >
                  Filtrar por:
                </Typography>
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  <Button
                    variant={filter === 'todas' ? 'contained' : 'outlined'}
                    onClick={() => {
                      setFilter('todas');
                      setCurrentPage(1);
                    }}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      minWidth: { xs: '100%', sm: 'auto' },
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
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      minWidth: { xs: '100%', sm: 'auto' },
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
                      px: { xs: 2, sm: 3 },
                      py: 1,
                      fontWeight: 600,
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      minWidth: { xs: '100%', sm: 'auto' },
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
              </Stack>

              {/* Barra de Busca */}
              {(locacoesAtivas.length > 0 || locacoesFinalizadas.length > 0) && (
                <Box>
                  <Typography 
                    variant="subtitle2" 
                    fontWeight={600} 
                    sx={{ 
                      mb: 2, 
                      color: 'text.secondary',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Buscar por cliente ou dispositivo:
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Digite o nome do cliente, email, nome do dispositivo ou MAC address..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton 
                            onClick={clearSearch}
                            size="small"
                            sx={{ color: 'text.secondary' }}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'warning.main',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'warning.main',
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        py: { xs: 1.2, sm: 1.5 }
                      }
                    }}
                  />
                  {searchTerm && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 2,
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      {locacoesFiltradas.length === 0 
                        ? 'Nenhuma locação encontrada para sua busca' 
                        : `${locacoesFiltradas.length} locação${locacoesFiltradas.length !== 1 ? 'ões' : ''} encontrada${locacoesFiltradas.length !== 1 ? 's' : ''}`
                      }
                    </Typography>
                  )}
                </Box>
              )}
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
              mb: { xs: 3, sm: 4 }
            }}
          >
            <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                flexWrap="wrap"
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: { xs: 1, sm: 0 } }}>
                  <Avatar sx={{ 
                    bgcolor: filter === 'ativas' ? 'warning.main' : 
                             filter === 'finalizadas' ? 'success.main' : 'primary.main' 
                  }}>
                    {filter === 'ativas' ? <PlayArrowIcon /> : 
                     filter === 'finalizadas' ? <HistoryIcon /> : <AssignmentIcon />}
                  </Avatar>
                  <Typography 
                    variant="h5" 
                    fontWeight={600}
                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                  >
                    {filter === 'ativas' ? 'Locações Ativas' : 
                     filter === 'finalizadas' ? 'Locações Finalizadas' : 'Todas as Locações'}
                  </Typography>
                </Stack>
                
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  alignItems="center"
                  sx={{ 
                    ml: { xs: 0, sm: 'auto' },
                    width: { xs: '100%', sm: 'auto' }
                  }}
                >
                  <Chip 
                    label={`${locacoesFiltradas.length} ${locacoesFiltradas.length === 1 ? 'item' : 'itens'}`}
                    size="small"
                    sx={{ 
                      fontSize: { xs: '0.75rem', sm: '0.875rem' },
                      alignSelf: { xs: 'flex-start', sm: 'center' }
                    }}
                  />
                  {(filter === 'todas' || filter === 'finalizadas') && (
                    <Stack 
                      direction="row" 
                      spacing={1} 
                      alignItems="center" 
                      sx={{ 
                        bgcolor: filter === 'finalizadas' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        px: { xs: 1.5, sm: 2 },
                        py: 1,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: filter === 'finalizadas' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        alignSelf: { xs: 'flex-start', sm: 'center' }
                      }}
                    >
                      <AttachMoneyIcon sx={{ 
                        color: filter === 'finalizadas' ? '#10b981' : '#6366f1',
                        fontSize: { xs: '1rem', sm: '1.1rem' }
                      }} />
                      <Typography 
                        variant="h6" 
                        fontWeight={700} 
                        color={filter === 'finalizadas' ? '#10b981' : '#6366f1'}
                        sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                      >
                        R$ {filter === 'finalizadas' ? valorTotalFinalizadas.toFixed(2) : valorTotalTodas.toFixed(2)}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Stack>
            </Box>
            
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {locacoesFiltradas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
                  <Avatar
                    sx={{
                      width: { xs: 56, sm: 64 },
                      height: { xs: 56, sm: 64 },
                      bgcolor: 'grey.100',
                      color: 'grey.400',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {searchTerm ? <SearchIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }} /> : <AssignmentIcon sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }} />}
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    {searchTerm ? 'Nenhuma locação encontrada' : 'Nenhuma locação encontrada'}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    {searchTerm ? 
                      'Tente ajustar os termos de busca ou limpe o filtro' :
                      filter === 'ativas' ? 'Não há locações ativas no momento' :
                      filter === 'finalizadas' ? 'Não há locações finalizadas ainda' :
                      'Não há locações cadastradas no sistema'
                    }
                  </Typography>
                  {searchTerm && (
                    <Button
                      variant="outlined"
                      onClick={clearSearch}
                      sx={{
                        borderColor: 'warning.main',
                        color: 'warning.main',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        px: { xs: 2, sm: 3 },
                        '&:hover': {
                          bgcolor: alpha('#f59e0b', 0.1),
                        }
                      }}
                    >
                      Limpar Filtro
                    </Button>
                  )}
                </Box>
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(2, 1fr)',
                        lg: 'repeat(3, 1fr)',
                      },
                      gap: { xs: 2, sm: 3 },
                      mb: { xs: 3, sm: 4 },
                    }}
                  >
                    {locacoesFiltradas.map((locacao) => renderLocacaoCard(locacao))}
                  </Box>

                  {totalPages > 1 && (
                    <Stack 
                      direction="row" 
                      justifyContent="center" 
                      sx={{ 
                        mt: { xs: 3, sm: 4 },
                        px: { xs: 1, sm: 0 }
                      }}
                    >
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, page) => setCurrentPage(page)}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                        sx={{
                          '& .MuiPaginationItem-root': {
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '1rem' },
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
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
              severity={snackbar.severity} 
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
}