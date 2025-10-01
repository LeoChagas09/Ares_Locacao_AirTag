// src/app/clientes/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper,
  Avatar,
  Stack,
  Container,
  alpha,
  Fade,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  Pagination,
  CircularProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import { ICliente } from '@/types/Cliente';
import clienteService from '@/services/api/clienteService';
import ClienteFormModal from '@/components/ClienteFormModal';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import EmailIcon from '@mui/icons-material/Email';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<ICliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<ICliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 4 clientes por página
  
  // Estados para Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Funções para Snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Funções de paginação e filtro
  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClientes = filteredClientes.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll suave para o topo da lista
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset para primeira página quando buscar
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Reset paginação quando clientes mudarem
  const resetPagination = () => {
    setCurrentPage(1);
  };

  const fetchClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
      resetPagination(); // Reset para primeira página
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      showSnackbar('Erro ao carregar clientes', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleOpenModal = (cliente?: ICliente) => {
    setEditingCliente(cliente || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCliente(null);
    setIsModalOpen(false);
  };

  const handleSaveCliente = async (cliente: Omit<ICliente, 'id_cliente'>) => {
    try {
      if (editingCliente) {
        await clienteService.update(editingCliente.id_cliente, cliente);
        showSnackbar('Cliente atualizado com sucesso!');
      } else {
        await clienteService.create(cliente);
        showSnackbar('Cliente cadastrado com sucesso!');
      }
      fetchClientes();
      handleCloseModal();
    } catch (error) {
      console.error('Falha ao salvar o cliente:', error);
      showSnackbar('Erro ao salvar cliente. Tente novamente.', 'error');
    }
  };

  const handleDelete = async (id_cliente: string) => {
    const cliente = clientes.find(c => c.id_cliente === id_cliente);
    if (cliente) {
      setClienteToDelete(cliente);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (clienteToDelete) {
      try {
        await clienteService.delete(clienteToDelete.id_cliente);
        showSnackbar('Cliente excluído com sucesso!');
        fetchClientes();
      } catch (error) {
        console.error('Falha ao deletar o cliente:', error);
        showSnackbar('Erro ao excluir cliente. Tente novamente.', 'error');
      } finally {
        setDeleteModalOpen(false);
        setClienteToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setClienteToDelete(null);
  };

  // Função para renderizar os cards dos clientes
  const renderClienteCard = (cliente: ICliente) => (
    <Box key={cliente.id_cliente} sx={{ mb: 3 }}>
      <Card 
        elevation={0}
        sx={{
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '@media (hover: hover)': {
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.15)',
              transform: 'translateY(-4px)',
            }
          }
        }}
      >
        <CardContent sx={{ p: 3, pb: 1 }}>
          <Stack spacing={2}>
            {/* Header do Card */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 48, 
                  height: 48,
                  fontSize: '1.2rem'
                }}
              >
                <PersonIcon />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Tooltip 
                  title={cliente.nome} 
                  arrow 
                  placement="top"
                  enterDelay={500}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight={700} 
                    color="text.primary" 
                    noWrap
                    sx={{ cursor: 'help' }}
                  >
                    {cliente.nome}
                  </Typography>
                </Tooltip>
              </Box>
            </Stack>
            
            {/* Informações do Cliente */}
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', width: 32, height: 32 }}>
                  <EmailIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    E-mail
                  </Typography>
                  <Tooltip 
                    title={cliente.email} 
                    arrow 
                    placement="bottom"
                    enterDelay={500}
                  >
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      noWrap
                      sx={{ cursor: 'help' }}
                    >
                      {cliente.email}
                    </Typography>
                  </Tooltip>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        
        <CardActions sx={{ p: 3, pt: 0, justifyContent: 'flex-end' }}>
          <Tooltip title="Editar cliente" arrow>
            <IconButton
              onClick={() => handleOpenModal(cliente)}
              sx={{
                bgcolor: alpha('#2563eb', 0.1),
                color: 'primary.main',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <EditIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir cliente" arrow>
            <IconButton
              onClick={() => handleDelete(cliente.id_cliente)}
              sx={{
                bgcolor: alpha('#ef4444', 0.1),
                color: 'error.main',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: 'error.main',
                  color: 'white',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <DeleteIcon sx={{ fontSize: '1.1rem' }} />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );

  if (loading) return (
    <Container maxWidth="xl" sx={{ py: 8, textAlign: 'center' }}>
      <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
        Carregando clientes...
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
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
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
                  Gestão de Clientes
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Gerencie todos os seus clientes em um só lugar
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenModal()}
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.2, sm: 1.5 },
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  minWidth: { xs: '100%', sm: 200 },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
                    border: '2px solid rgba(255,255,255,0.3)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Novo Cliente
              </Button>
            </Stack>
          </Paper>

          {/* Barra de Pesquisa */}
          {clientes.length > 0 && (
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
              <TextField
                fullWidth
                placeholder="Buscar por nome ou email..."
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
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    }
                  }
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    fontSize: '1rem',
                    py: 1.5
                  }
                }}
              />
              {searchTerm && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  {filteredClientes.length === 0 
                    ? 'Nenhum cliente encontrado para sua busca' 
                    : `${filteredClientes.length} cliente${filteredClientes.length !== 1 ? 's' : ''} encontrado${filteredClientes.length !== 1 ? 's' : ''}`
                  }
                </Typography>
              )}
            </Paper>
          )}

          {/* Cards dos Clientes */}
          <Box>
            {clientes.length === 0 ? (
              <Paper 
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  bgcolor: 'background.paper'
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: alpha('#6b7280', 0.1), 
                    color: '#6b7280',
                    width: 64, 
                    height: 64,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <PersonIcon sx={{ fontSize: '2rem' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Nenhum cliente cadastrado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Comece adicionando seu primeiro cliente ao sistema
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModal()}
                  sx={{
                    bgcolor: '#f59e0b',
                    '&:hover': {
                      bgcolor: '#d97706',
                    }
                  }}
                >
                  Adicionar Cliente
                </Button>
              </Paper>
            ) : filteredClientes.length === 0 ? (
              <Paper 
                elevation={0}
                sx={{
                  p: 8,
                  textAlign: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  bgcolor: 'background.paper'
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: alpha('#6b7280', 0.1), 
                    color: '#6b7280',
                    width: 64, 
                    height: 64,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <SearchIcon sx={{ fontSize: '2rem' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Nenhum cliente encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Tente ajustar os termos de busca ou limpe o filtro para ver todos os clientes
                </Typography>
                <Button
                  variant="outlined"
                  onClick={clearSearch}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: alpha('#2563eb', 0.1),
                    }
                  }}
                >
                  Limpar Filtro
                </Button>
              </Paper>
            ) : (
              <Box>
                {/* Lista de Clientes */}
                <Box sx={{ mb: 4 }}>
                  {currentClientes.map(renderClienteCard)}
                </Box>
                
                {/* Paginação */}
                {totalPages > 1 && (
                  <Paper 
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body2" color="text.secondary">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, filteredClientes.length)} de {filteredClientes.length} clientes
                        {searchTerm && ` (filtrados de ${clientes.length} total)`}
                      </Typography>
                    </Stack>
                    
                    <Pagination 
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          fontSize: '1rem',
                          fontWeight: 600,
                          '&.Mui-selected': {
                            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
                            }
                          }
                        }
                      }}
                    />
                  </Paper>
                )}
              </Box>
            )}
          </Box>

          {/* Modal de Confirmação de Exclusão */}
          <Dialog 
            open={deleteModalOpen} 
            onClose={cancelDelete}
            PaperProps={{
              sx: {
                borderRadius: 3,
                minWidth: 400,
              }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'error.main', width: 48, height: 48 }}>
                  <WarningIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Confirmar Exclusão
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Esta ação não pode ser desfeita
                  </Typography>
                </Box>
              </Stack>
            </DialogTitle>
            
            <Divider />
            
            <DialogContent sx={{ pt: 3 }}>
              <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
                Tem certeza que deseja excluir o cliente?
              </Typography>
              
              {clienteToDelete && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#ef4444', 0.05),
                    border: '1px solid',
                    borderColor: alpha('#ef4444', 0.2),
                    borderRadius: 2
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                      <PersonIcon sx={{ fontSize: '1rem' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {clienteToDelete.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {clienteToDelete.email}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              )}
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button 
                onClick={cancelDelete}
                variant="outlined"
                sx={{ 
                  px: 3,
                  borderColor: 'divider',
                  color: 'text.secondary'
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={confirmDelete}
                variant="contained"
                color="error"
                sx={{
                  px: 3,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                  }
                }}
              >
                Excluir Cliente
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal */}
          <ClienteFormModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSaveCliente}
            initialData={editingCliente}
          />
          
          {/* Snackbar para notificações */}
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={4000} 
            onClose={closeSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert 
              onClose={closeSnackbar} 
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