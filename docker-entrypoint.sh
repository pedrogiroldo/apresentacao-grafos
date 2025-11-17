#!/bin/sh
set -e

echo "🚀 Iniciando aplicação..."

# Adicionar pnpm ao PATH se necessário
export PATH="/usr/local/bin:$PATH"

# Verificar se DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  AVISO: DATABASE_URL não está definida"
else
  echo "✅ DATABASE_URL configurada"
fi

# Banco de dados é externo, não precisa aguardar

# Executar migrations do Prisma (se necessário)
echo "📦 Executando migrations do Prisma..."
pnpm prisma migrate deploy 2>&1 || echo "⚠️  Migrations já aplicadas ou erro ao executar"

# Gerar Prisma Client (garantir que está atualizado)
echo "🔧 Gerando Prisma Client..."
pnpm prisma generate

# Iniciar aplicação
echo "🎯 Iniciando servidor..."
exec "$@"
