// src/components/DispositivoFormModal/index.tsx
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import { IDispositivo } from '@/types/Dispositivo';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DevicesIcon from '@mui/icons-material/Devices';
import RouterIcon from '@mui/icons-material/Router';
import EditIcon from '@mui/icons-material/Edit';

type FormData = Omit<IDispositivo, 'id'>;

interface DispositivoFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: IDispositivo | null;
}

export default function DispositivoFormModal({ open, onClose, onSubmit, initialData }: DispositivoFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ nome: '', macAddress: '' });
    }
  }, [initialData, open, reset]);

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
              bgcolor: isEditing ? 'warning.main' : 'success.main',
              width: 48,
              height: 48
            }}
          >
            {isEditing ? <EditIcon /> : <AddCircleIcon />}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {isEditing ? 'Editar Dispositivo' : 'Adicionar Novo Dispositivo'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditing 
                ? 'Atualize as informações do dispositivo' 
                : 'Preencha os dados para cadastrar um novo dispositivo'
              }
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>
      
      <Divider />
      
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nome do Dispositivo *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ex: AirTag, etc."
                {...register('nome', { required: 'Nome é obrigatório' })}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                InputProps={{
                  startAdornment: (
                    <DevicesIcon sx={{ color: 'text.secondary', mr: 1 }} />
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
                MAC Address *
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ex: 00:1B:44:11:3A:B7"
                {...register('macAddress', { 
                  required: 'MAC Address é obrigatório',
                  pattern: {
                    value: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
                    message: 'Formato inválido. Use: XX:XX:XX:XX:XX:XX'
                  }
                })}
                error={!!errors.macAddress}
                helperText={errors.macAddress?.message || 'Formato: XX:XX:XX:XX:XX:XX'}
                InputProps={{
                  startAdornment: (
                    <RouterIcon sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: alpha('#f8fafc', 0.5),
                    fontFamily: 'monospace',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'white',
                    },
                  },
                  '& input': {
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                  }
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
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              '&:hover': {
                background: isEditing 
                  ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                  : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
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