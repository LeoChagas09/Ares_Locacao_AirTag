// src/components/ClienteFormModal/index.tsx
'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Box,
  Stack,
  Avatar,
  Typography,
  Divider,
  alpha
} from '@mui/material';
import { ICliente } from '@/types/Cliente';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EditIcon from '@mui/icons-material/Edit';

// Os dados do formulário não incluem o 'id'
type FormData = Omit<ICliente, 'id'>;

interface ClienteFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: ICliente | null; // Dados para o modo de edição
}

export default function ClienteFormModal({ open, onClose, onSubmit, initialData }: ClienteFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  // Se 'initialData' mudar (ex: ao clicar em editar), reseta o formulário com os novos dados
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ nome: '', email: '' });
    }
  }, [initialData, open, reset]);

  const handleFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  const isEditing = !!initialData;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: isEditing ? 'warning.main' : 'primary.main',
              width: 48,
              height: 48
            }}
          >
            {isEditing ? <EditIcon /> : <PersonAddIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing 
                ? 'Atualize as informações do cliente' 
                : 'Preencha os dados para cadastrar um novo cliente'
              }
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      
      <Divider />
      
      <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nome Completo *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Digite o nome completo do cliente"
                {...register('nome', { required: 'Nome é obrigatório' })}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                InputProps={{
                  startAdornment: (
                    <PersonIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#f8fafc', 0.5),
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />
            </Box>
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                E-mail *
              </Typography>
              <TextField
                fullWidth
                type="email"
                variant="outlined"
                placeholder="Digite o e-mail do cliente"
                {...register('email', { 
                  required: 'E-mail é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <EmailIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#f8fafc', 0.5),
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={onClose}
            variant="outlined"
            sx={{ 
              px: 3,
              borderColor: 'divider',
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'text.secondary',
                backgroundColor: alpha('#000', 0.04),
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              px: 4,
              background: isEditing 
                ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              '&:hover': {
                background: isEditing 
                  ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                  : 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              }
            }}
          >
            {isEditing ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}