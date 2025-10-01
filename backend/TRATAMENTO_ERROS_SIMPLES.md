# Sistema de Tratamento de Erros com Zod

## 🎯 Como Funciona

Este sistema usa **Zod** para validações e é **simples** e **profissional**.

### 1. Estrutura dos Erros (`src/utils/errors.ts`)

```typescript
// Uma classe simples para todos os erros da API
export class APIError extends Error {
  public statusCode: number;
  
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Funções helpers para criar erros específicos
export const ErrorTypes = {
  badRequest: (message) => new APIError(message, 400),    // Dados inválidos
  notFound: (resource) => new APIError(`${resource} não encontrado`, 404),
  conflict: (message) => new APIError(message, 409),      // Já existe
  internal: (message) => new APIError(message, 500)       // Erro do servidor
};
```

### 2. Validações com Zod (`src/utils/validations.ts`)

```typescript
import { z } from 'zod';

// Schemas que validam E transformam os dados
export const clienteSchema = z.object({
  nome: z.string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(), // ⭐ Transforma automaticamente
    
  email: z.string()
    .email("Email deve ter um formato válido")
    .toLowerCase() // ⭐ Transforma automaticamente
    .trim()
});

export const dispositivoSchema = z.object({
  nome: z.string().min(2).max(100).trim(),
  macAddress: z.string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "MAC Address inválido")
    .transform(mac => mac.toUpperCase()) // ⭐ Transforma automaticamente
});

// Função helper que pega erros do Zod e converte para nosso formato
export const validar = {
  cliente: (dados) => {
    try {
      return clienteSchema.parse(dados); // ⭐ Retorna dados limpos
    } catch (error) {
      if (error instanceof z.ZodError) {
        const mensagem = error.issues.map(err => err.message).join(', ');
        throw ErrorTypes.badRequest(mensagem);
      }
      throw error;
    }
  }
};

// ⭐ Tipos TypeScript gerados automaticamente!
export type ClienteInput = z.infer<typeof clienteSchema>;
```

### 3. Middleware de Tratamento (`src/middleware/errorHandler.ts`)

```typescript
export const errorHandler = (error, req, res, next) => {
  // Se é um erro da nossa API
  if (error instanceof APIError) {
    return res.status(error.statusCode).json({
      erro: true,
      mensagem: error.message,
      codigo: error.statusCode
    });
  }
  
  // Trata erros do Prisma automaticamente
  // Retorna erro genérico para casos não tratados
};
```

## 🚀 Como Usar no Controller

**ANTES (validações manuais e verbosas):**
```typescript
async create(req, res, next) {
  try {
    const { nome, email } = req.body;
    
    // ❌ Muitas validações manuais
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    if (nome.length < 2) {
      return res.status(400).json({ error: 'Nome muito curto' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }
    
    // ❌ Transformações manuais
    const dadosLimpos = {
      nome: nome.trim(),
      email: email.toLowerCase().trim()
    };
    
    const cliente = await this.service.create(dadosLimpos);
    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
```

**DEPOIS (com Zod - simples e poderoso):**
```typescript
async create(req, res, next) {
  try {
    // ✅ UMA linha valida e transforma tudo!
    const dadosValidados = validar.cliente(req.body);
    
    // ✅ Dados já estão limpos e validados
    const cliente = await this.service.create(dadosValidados);
    
    // ✅ Resposta padronizada
    res.status(201).json({
      sucesso: true,
      dados: cliente,
      mensagem: 'Cliente criado com sucesso'
    });
    
  } catch (error) {
    // ✅ Middleware trata tudo
    next(error);
  }
}
```

## 🎯 Como Usar no Service

```typescript
// ⭐ Usa tipos do Zod automaticamente
async create({ nome, email }: ClienteInput) {
  // Verifica se já existe
  const jaExiste = await this.prisma.cliente.findFirst({
    where: { email } // ⭐ email já vem lowercase do Zod!
  });
  
  if (jaExiste) {
    throw ErrorTypes.conflict("Já existe um cliente com este e-mail");
  }
  
  // ⭐ Dados já estão limpos, não precisa transformar
  const cliente = await this.prisma.cliente.create({
    data: { nome, email } // ⭐ Já estão trim() e toLowerCase()
  });
  
  return cliente;
}
```

## 📋 Formato das Respostas

### ✅ Sucesso:
```json
{
  "sucesso": true,
  "dados": { "id": "123", "nome": "João" },
  "mensagem": "Cliente criado com sucesso"
}
```

### ❌ Erro:
```json
{
  "erro": true,
  "mensagem": "Email deve ter um formato válido",
  "codigo": 400
}
```

## 🔥 Vantagens da Abordagem com Zod

### ✅ **Validação + Transformação em 1 linha**
```typescript
// Uma linha faz tudo isso:
const dados = validar.cliente(req.body);
// ✓ Valida se nome existe e tem 2-100 chars
// ✓ Valida se email tem formato correto
// ✓ Aplica trim() no nome
// ✓ Aplica toLowerCase() e trim() no email
// ✓ Gera tipos TypeScript automaticamente
```

### ✅ **Sem código repetitivo**
- Antes: 15+ linhas de validação manual
- Depois: 1 linha com Zod

### ✅ **Tipos TypeScript automáticos**
```typescript
export type ClienteInput = z.infer<typeof clienteSchema>;
// Tipo gerado automaticamente pelo schema!
```

### ✅ **Transformações automáticas**
```typescript
// MAC Address sempre fica maiúsculo
// Email sempre fica minúsculo
// Strings sempre têm trim()
```

### ✅ **Mensagens de erro claras**
```typescript
// Se mandar { nome: "A", email: "invalid" }
// Retorna: "Nome deve ter pelo menos 2 caracteres, Email deve ter um formato válido"
```

## 🎪 Para a Apresentação

### **Mostre o Contraste:**

1. **Slide 1 - O Problema:**
   - Controller cheio de validações manuais
   - Transformações espalhadas
   - Código repetitivo

2. **Slide 2 - A Solução:**
   - 1 linha com Zod
   - Middleware centralizando erros
   - Tipos automáticos

3. **Slide 3 - Demonstração:**
   - Teste uma requisição inválida
   - Mostre a resposta formatada
   - Mostre como o código ficou limpo

### **Vantagens para Mencionar:**
- ⚡ **Produtividade:** Menos código, mais funcionalidade
- 🛡️ **Segurança:** Validação robusta e automática
- 🔧 **Manutenção:** Centralizado e consistente
- 📘 **TypeScript:** Tipos gerados automaticamente
- 🚀 **Escalabilidade:** Fácil adicionar novas validações

É uma solução **simples, profissional e impressionante**! 🎯