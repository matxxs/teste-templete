/*
  # Sistema de autenticação com username único

  1. Novas Tabelas
    - `usuarios`
      - `usuario_id` (uuid, primary key)
      - `username` (text, unique) - Nome de usuário único estilo gaming
      - `nome` (text) - Nome completo
      - `email` (text, unique) - Email
      - `senha_hash` (text) - Hash da senha
      - `nivel_acesso` (text) - USUARIO, ADMINISTRADOR, MASTER
      - `ativo` (boolean) - Status ativo/inativo
      - `data_criacao` (timestamptz)
      - `data_modificacao` (timestamptz)

    - `grupos`
      - `grupo_id` (uuid, primary key)
      - `nome` (text) - Nome do grupo
      - `descricao` (text) - Descrição
      - `cor_tag` (text) - Cor em hexadecimal
      - `data_criacao` (timestamptz)
      - `data_modificacao` (timestamptz)

    - `itens_drive`
      - `item_id` (uuid, primary key)
      - `parent_id` (uuid, nullable) - Referência ao item pai (pasta)
      - `nome` (text) - Nome do arquivo/pasta
      - `tipo` (text) - 'pasta' ou 'arquivo'
      - `path_disco` (text) - Caminho no disco
      - `usuario_id` (uuid) - Proprietário
      - `grupo_id` (uuid, nullable) - Grupo associado
      - `tamanho` (bigint, nullable) - Tamanho em bytes
      - `mime_type` (text, nullable) - Tipo MIME
      - `data_criacao` (timestamptz)
      - `data_modificacao` (timestamptz)

    - `auditoria_usuarios`
      - Registro de mudanças em usuários
    
    - `auditoria_grupos`
      - Registro de mudanças em grupos
    
    - `auditoria_itens_drive`
      - Registro de mudanças em itens do drive

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas restritivas para cada tipo de operação
    - Apenas usuários autenticados podem acessar dados
    - Administradores têm acesso completo
*/

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  usuario_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  nome text NOT NULL,
  email text UNIQUE NOT NULL,
  senha_hash text NOT NULL,
  nivel_acesso text NOT NULL DEFAULT 'USUARIO',
  ativo boolean NOT NULL DEFAULT true,
  data_criacao timestamptz DEFAULT now(),
  data_modificacao timestamptz DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);

-- Criar tabela de grupos
CREATE TABLE IF NOT EXISTS grupos (
  grupo_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  cor_tag text DEFAULT '#3B82F6',
  data_criacao timestamptz DEFAULT now(),
  data_modificacao timestamptz DEFAULT now()
);

-- Criar tabela de itens do drive
CREATE TABLE IF NOT EXISTS itens_drive (
  item_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES itens_drive(item_id) ON DELETE CASCADE,
  nome text NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('pasta', 'arquivo')),
  path_disco text NOT NULL,
  usuario_id uuid NOT NULL REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
  grupo_id uuid REFERENCES grupos(grupo_id) ON DELETE SET NULL,
  tamanho bigint,
  mime_type text,
  data_criacao timestamptz DEFAULT now(),
  data_modificacao timestamptz DEFAULT now()
);

-- Criar índices para itens do drive
CREATE INDEX IF NOT EXISTS idx_itens_drive_parent ON itens_drive(parent_id);
CREATE INDEX IF NOT EXISTS idx_itens_drive_usuario ON itens_drive(usuario_id);
CREATE INDEX IF NOT EXISTS idx_itens_drive_grupo ON itens_drive(grupo_id);
CREATE INDEX IF NOT EXISTS idx_itens_drive_tipo ON itens_drive(tipo);

-- Criar tabelas de auditoria
CREATE TABLE IF NOT EXISTS auditoria_usuarios (
  aud_id bigserial PRIMARY KEY,
  usuario_id uuid NOT NULL,
  username text,
  nome text,
  email text,
  ativo boolean,
  acao text NOT NULL,
  usuario_sessao text,
  data_auditoria timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auditoria_grupos (
  aud_id bigserial PRIMARY KEY,
  grupo_id uuid NOT NULL,
  nome text,
  descricao text,
  cor_tag text,
  acao text NOT NULL,
  usuario_sessao text,
  data_auditoria timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auditoria_itens_drive (
  aud_id bigserial PRIMARY KEY,
  item_id uuid NOT NULL,
  acao text NOT NULL,
  usuario_sessao text,
  dados_antigos jsonb,
  dados_novos jsonb,
  data_auditoria timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_drive ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE auditoria_itens_drive ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários (apenas autenticados podem ver)
CREATE POLICY "Usuários autenticados podem ver todos os usuários"
  ON usuarios FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Apenas administradores podem criar usuários"
  ON usuarios FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

CREATE POLICY "Apenas administradores podem atualizar usuários"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

CREATE POLICY "Apenas administradores podem excluir usuários"
  ON usuarios FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

-- Políticas para grupos
CREATE POLICY "Usuários autenticados podem ver grupos"
  ON grupos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Apenas administradores podem criar grupos"
  ON grupos FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

CREATE POLICY "Apenas administradores podem atualizar grupos"
  ON grupos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

CREATE POLICY "Apenas administradores podem excluir grupos"
  ON grupos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

-- Políticas para itens do drive
CREATE POLICY "Usuários podem ver todos os itens"
  ON itens_drive FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar itens"
  ON itens_drive FOR INSERT
  TO authenticated
  WITH CHECK (
    usuario_id = (current_setting('app.current_user_id')::uuid)
  );

CREATE POLICY "Usuários podem atualizar próprios itens"
  ON itens_drive FOR UPDATE
  TO authenticated
  USING (
    usuario_id = (current_setting('app.current_user_id')::uuid)
  );

CREATE POLICY "Usuários podem excluir próprios itens"
  ON itens_drive FOR DELETE
  TO authenticated
  USING (
    usuario_id = (current_setting('app.current_user_id')::uuid)
  );

-- Políticas para auditoria (apenas leitura para administradores)
CREATE POLICY "Administradores podem ver auditoria de usuários"
  ON auditoria_usuarios FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

CREATE POLICY "Administradores podem ver auditoria de grupos"
  ON auditoria_grupos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

CREATE POLICY "Administradores podem ver auditoria de itens"
  ON auditoria_itens_drive FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM usuarios u
      WHERE u.usuario_id = (current_setting('app.current_user_id')::uuid)
      AND u.nivel_acesso IN ('ADMINISTRADOR', 'MASTER')
    )
  );

-- Inserir dados mockados
INSERT INTO usuarios (usuario_id, username, nome, email, senha_hash, nivel_acesso, ativo) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'admin', 'Administrador do Sistema', 'admin@docmanager.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5CQ.FfL.8nXdS', 'MASTER', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'joao_silva', 'João Silva', 'joao.silva@empresa.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5CQ.FfL.8nXdS', 'USUARIO', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'maria_santos', 'Maria Santos', 'maria.santos@empresa.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5CQ.FfL.8nXdS', 'ADMINISTRADOR', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'pedro_costa', 'Pedro Costa', 'pedro.costa@empresa.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5CQ.FfL.8nXdS', 'USUARIO', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'ana_oliveira', 'Ana Oliveira', 'ana.oliveira@empresa.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5CQ.FfL.8nXdS', 'USUARIO', true);

INSERT INTO grupos (grupo_id, nome, descricao, cor_tag) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Documentos Fiscais', 'Notas fiscais, recibos e documentação contábil', '#EF4444'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Contratos', 'Contratos de trabalho, prestação de serviços e parcerias', '#3B82F6'),
  ('660e8400-e29b-41d4-a716-446655440003', 'Relatórios', 'Relatórios mensais, anuais e apresentações', '#22C55E'),
  ('660e8400-e29b-41d4-a716-446655440004', 'RH', 'Documentos de recursos humanos', '#F59E0B'),
  ('660e8400-e29b-41d4-a716-446655440005', 'Marketing', 'Materiais de divulgação e campanhas', '#EC4899');

INSERT INTO itens_drive (item_id, parent_id, nome, tipo, path_disco, usuario_id, grupo_id, tamanho, mime_type) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', NULL, 'Documentos 2024', 'pasta', '/drive/770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NULL, NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440002', NULL, 'Projetos', 'pasta', '/drive/770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', NULL, NULL, NULL),
  ('770e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440001', 'Relatório Anual 2024.pdf', 'arquivo', '/drive/770e8400-e29b-41d4-a716-446655440001/relatorio_anual_2024.pdf', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', 2458624, 'application/pdf'),
  ('770e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440001', 'Contrato Fornecedor XYZ.pdf', 'arquivo', '/drive/770e8400-e29b-41d4-a716-446655440001/contrato_xyz.pdf', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 1536000, 'application/pdf'),
  ('770e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440002', 'Proposta Comercial.docx', 'arquivo', '/drive/770e8400-e29b-41d4-a716-446655440002/proposta.docx', '550e8400-e29b-41d4-a716-446655440002', NULL, 987456, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

INSERT INTO auditoria_usuarios (usuario_id, username, nome, email, ativo, acao, usuario_sessao, data_auditoria) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'joao_silva', 'João Silva', 'joao.silva@empresa.com', true, 'INSERT', 'admin', now() - interval '5 days'),
  ('550e8400-e29b-41d4-a716-446655440003', 'maria_santos', 'Maria Santos', 'maria.santos@empresa.com', true, 'INSERT', 'admin', now() - interval '4 days'),
  ('550e8400-e29b-41d4-a716-446655440003', 'maria_santos', 'Maria Santos', 'maria.santos@empresa.com', true, 'UPDATE', 'admin', now() - interval '2 days');

INSERT INTO auditoria_grupos (grupo_id, nome, descricao, cor_tag, acao, usuario_sessao, data_auditoria) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', 'Documentos Fiscais', 'Notas fiscais, recibos e documentação contábil', '#EF4444', 'INSERT', 'admin', now() - interval '3 days'),
  ('660e8400-e29b-41d4-a716-446655440002', 'Contratos', 'Contratos de trabalho, prestação de serviços e parcerias', '#3B82F6', 'INSERT', 'admin', now() - interval '3 days');

INSERT INTO auditoria_itens_drive (item_id, acao, usuario_sessao, dados_novos, data_auditoria) VALUES
  ('770e8400-e29b-41d4-a716-446655440003', 'INSERT', 'admin', '{"nome": "Relatório Anual 2024.pdf", "tipo": "arquivo"}'::jsonb, now() - interval '2 days'),
  ('770e8400-e29b-41d4-a716-446655440004', 'INSERT', 'maria_santos', '{"nome": "Contrato Fornecedor XYZ.pdf", "tipo": "arquivo"}'::jsonb, now() - interval '1 day');
