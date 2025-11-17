# 🐳 Docker Setup

Este guia explica como executar a aplicação usando Docker.

**Nota:** O banco de dados é externo e não roda no Docker. Você precisa ter um banco PostgreSQL configurado e acessível.

## 📋 Pré-requisitos

- Docker instalado
- Docker Compose instalado (opcional, mas recomendado)
- Banco de dados PostgreSQL externo configurado e acessível

## 🚀 Como usar

### Opção 1: Docker Compose (Recomendado)

1. **Criar arquivo `.env`** na raiz do projeto com a URL do seu banco externo:
```env
DATABASE_URL="postgresql://usuario:senha@host-do-banco:5432/nome-do-banco?schema=public"
```

**Exemplos:**
- Banco local: `postgresql://postgres:senha@localhost:5432/apresentacao_grafos?schema=public`
- Banco remoto: `postgresql://user:pass@db.example.com:5432/mydb?schema=public`
- Cloud (Supabase/Neon/etc): `postgresql://user:pass@host.supabase.co:5432/postgres?schema=public`

2. **Subir o container**:
```bash
docker-compose up -d
```

3. **Verificar logs**:
```bash
docker-compose logs -f app
```

4. **Acessar a aplicação**:
   - Aplicação: http://localhost:3000

### Opção 2: Docker apenas (sem Compose)

1. **Criar arquivo `.env`** com a URL do seu banco:
```env
DATABASE_URL="postgresql://usuario:senha@host:5432/database?schema=public"
```

2. **Build da imagem**:
```bash
docker build -t apresentacao-grafos .
```

3. **Rodar o container**:
```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  --name apresentacao-grafos \
  apresentacao-grafos
```

## 🔧 Comandos úteis

### Ver logs
```bash
docker-compose logs -f app
# ou
docker logs -f apresentacao-grafos
```

### Parar containers
```bash
docker-compose down
# ou
docker stop apresentacao-grafos
```

### Executar comandos no container
```bash
# Acessar shell do container
docker-compose exec app sh
# ou
docker exec -it apresentacao-grafos sh

# Executar migrations manualmente
docker-compose exec app pnpm prisma migrate deploy
# ou
docker exec apresentacao-grafos pnpm prisma migrate deploy

# Ver status do Prisma
docker-compose exec app pnpm prisma migrate status

# Abrir Prisma Studio (requer porta adicional)
docker-compose exec app pnpm prisma studio --port 5555
```

### Rebuild após mudanças
```bash
docker-compose build --no-cache
docker-compose up -d
```

## 🌐 Deploy em produção

### Variáveis de ambiente importantes

```env
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
```

### Build para produção

```bash
docker build -t apresentacao-grafos:latest .
```

### Rodar em produção

```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name apresentacao-grafos \
  apresentacao-grafos:latest
```

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
- Verifique se o banco PostgreSQL está acessível do host onde o Docker está rodando
- Verifique a `DATABASE_URL` no `.env` (deve apontar para o banco externo)
- Se o banco está em outro servidor, verifique firewall/security groups
- Teste a conexão manualmente: `psql $DATABASE_URL`
- Se o banco está em `localhost` na máquina host, use `host.docker.internal` no Docker:
  ```env
  DATABASE_URL="postgresql://user:pass@host.docker.internal:5432/db?schema=public"
  ```

### Erro de permissões
- O container roda como usuário não-root (`nextjs`)
- Se precisar de permissões especiais, ajuste no Dockerfile

### Porta já em uso
- Altere a porta no `docker-compose.yml`:
```yaml
ports:
  - "3001:3000"  # Usa porta 3001 no host
```

### Rebuild completo
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Notas

- O entrypoint script executa migrations automaticamente na inicialização
- O Socket.io funciona normalmente no Docker
- O banco de dados é externo e deve estar acessível do container
- Se o banco está em `localhost` na máquina host, use `host.docker.internal` como hostname
- Para produção, use um banco de dados gerenciado (RDS, Cloud SQL, Supabase, Neon, etc.)
- Certifique-se de que o firewall permite conexões do container ao banco
