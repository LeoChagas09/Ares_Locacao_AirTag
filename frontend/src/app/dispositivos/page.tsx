 
// src/app/dispositivos/page.tsx
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
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Snackbar,
  Alert,
  Pagination,
  CircularProgress
} from '@mui/material';
import { IDispositivo } from '@/types/Dispositivo';
import dispositivoService from '@/services/api/dispositivoService';
import DispositivoFormModal from '@/components/DispositivoFormModal';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DevicesIcon from '@mui/icons-material/Devices';
import RouterIcon from '@mui/icons-material/Router';
import WarningIcon from '@mui/icons-material/Warning';
import MemoryIcon from '@mui/icons-material/Memory';

export default function DispositivosPage() {
  const [dispositivos, setDispositivos] = useState<IDispositivo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDispositivo, setEditingDispositivo] = useState<IDispositivo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [dispositivoToDelete, setDispositivoToDelete] = useState<IDispositivo | null>(null);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 6 dispositivos por página
  
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

  // Funções de paginação
  const totalPages = Math.ceil(dispositivos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDispositivos = dispositivos.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  const fetchDispositivos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dispositivoService.getAll();
      setDispositivos(data);
      resetPagination();
    } catch (error) {
      console.error('Erro ao buscar dispositivos:', error);
      showSnackbar('Erro ao carregar dispositivos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispositivos();
  }, [fetchDispositivos]);

  const handleOpenModal = (dispositivo?: IDispositivo) => {
    setEditingDispositivo(dispositivo || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDispositivo(null);
    setIsModalOpen(false);
  };

  const handleSaveDispositivo = async (dispositivo: Omit<IDispositivo, 'id_dispositivo'>) => {
    try {
      if (editingDispositivo) {
        await dispositivoService.update(editingDispositivo.id_dispositivo, dispositivo);
        showSnackbar('Dispositivo atualizado com sucesso!');
      } else {
        await dispositivoService.create(dispositivo);
        showSnackbar('Dispositivo cadastrado com sucesso!');
      }
      fetchDispositivos();
      handleCloseModal();
    } catch (error) {
      console.error('Falha ao salvar o dispositivo:', error);
      showSnackbar('Erro ao salvar dispositivo. Tente novamente.', 'error');
    }
  };

  const handleDelete = async (id_dispositivo: string) => {
    const dispositivo = dispositivos.find(d => d.id_dispositivo === id_dispositivo);
    if (dispositivo) {
      setDispositivoToDelete(dispositivo);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (dispositivoToDelete) {
      try {
        await dispositivoService.delete(dispositivoToDelete.id_dispositivo);
        showSnackbar('Dispositivo excluído com sucesso!');
        fetchDispositivos();
      } catch (error) {
        console.error('Falha ao deletar o dispositivo:', error);
        showSnackbar('Erro ao excluir dispositivo. Tente novamente.', 'error');
      } finally {
        setDeleteModalOpen(false);
        setDispositivoToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setDispositivoToDelete(null);
  };

  // Função para renderizar os cards dos dispositivos
  const renderDispositivoCard = (dispositivo: IDispositivo) => (
    <Box key={dispositivo.id_dispositivo} sx={{ mb: 3 }}>
      <Card 
        elevation={0}
        sx={{
          height: '100%',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'success.main',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.15)',
            transform: 'translateY(-4px)',
          }
        }}
      >
        <CardContent sx={{ p: 3, pb: 1 }}>
          <Stack spacing={2}>
            {/* Header do Card */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar 
                sx={{ 
                  bgcolor: 'success.main', 
                  width: 48, 
                  height: 48,
                  fontSize: '1.2rem'
                }}
              >
                <DevicesIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={700} color="text.primary" noWrap>
                  {dispositivo.nome}
                </Typography>
              </Box>
            </Stack>
            
            {/* Informações do Dispositivo */}
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: alpha('#2563eb', 0.1), color: 'primary.main', width: 32, height: 32 }}>
                  <RouterIcon sx={{ fontSize: '1rem' }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600} color="text.primary">
                    MAC Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                    {dispositivo.macAddress}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
        
        <CardActions sx={{ p: 3, pt: 0, justifyContent: 'flex-end' }}>
          <Tooltip title="Editar dispositivo">
            <IconButton
              onClick={() => handleOpenModal(dispositivo)}
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
          <Tooltip title="Excluir dispositivo">
            <IconButton
              onClick={() => handleDelete(dispositivo.id_dispositivo)}
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
    <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
      <CircularProgress size={60} sx={{ color: 'success.main' }} />
      <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
        Carregando dispositivos...
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: 3
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  Controle de Dispositivos
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                  Monitore e gerencie todos os dispositivos disponíveis
                </Typography>
                {dispositivos.length > 0 && (
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ opacity: 0.8 }}>
                    <Typography variant="body2">
                      Total: {dispositivos.length} dispositivo{dispositivos.length !== 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="body2">•</Typography>
                    <Typography variant="body2">
                      Página {currentPage} de {totalPages}
                    </Typography>
                  </Stack>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenModal()}
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                  minWidth: 200
                }}
              >
                Novo Dispositivo
              </Button>
            </Stack>
          </Paper>

          {/* Cards dos Dispositivos */}
          <Box>
            {dispositivos.length === 0 ? (
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
                  <DevicesIcon sx={{ fontSize: '2rem' }} />
                </Avatar>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  Nenhum dispositivo cadastrado
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Comece adicionando seu primeiro dispositivo ao sistema
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModal()}
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    }
                  }}
                >
                  Adicionar Dispositivo
                </Button>
              </Paper>
            ) : (
              <Box>
                {/* Lista de Dispositivos */}
                <Box sx={{ mb: 4 }}>
                  {currentDispositivos.map(renderDispositivoCard)}
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
                        Mostrando {startIndex + 1}-{Math.min(endIndex, dispositivos.length)} de {dispositivos.length} dispositivos
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
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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
                Tem certeza que deseja excluir o dispositivo?
              </Typography>
              
              {dispositivoToDelete && (
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
                    <Avatar sx={{ bgcolor: 'success.main', width: 32, height: 32 }}>
                      <DevicesIcon sx={{ fontSize: '1rem' }} />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {dispositivoToDelete.nome}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dispositivoToDelete.macAddress}
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
                Excluir Dispositivo
              </Button>
            </DialogActions>
          </Dialog>

          {/* Modal */}
          <DispositivoFormModal
            open={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleSaveDispositivo}
            initialData={editingDispositivo}
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