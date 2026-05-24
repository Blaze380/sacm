# Fluxos Explícitos dos Processos (Casos de Uso Encadeados)

## Objetivo

Representar, por processo de negócio, quais casos de uso compõem cada fluxo principal do sistema.

---

# 1. Processo de Cadastro do Paciente

## Fluxo do processo

Este processo permite que um utilizador passe a ser paciente da plataforma.

Fluxo:

```text
UC01 Cadastrar-se na plataforma
   ↓
UC02 Fazer login
   ↓
UC04 Alterar dados do perfil (opcional)
```

Resultado:
Paciente apto a interagir com o sistema.

Fluxos relacionados:

* UC03 Recuperar senha (fluxo alternativo)
* UC05 Logout

---

# 2. Processo de Triagem Digital

## Fluxo do processo

O paciente solicita atendimento e fornece informações clínicas iniciais.

Fluxo:

```text
UC02 Fazer login
↓
UC06 Submeter triagem digital
↓
UC07 Informar sintomas e queixa principal
↓
UC08 Definir prioridade (normal ou prioritário)
↓
UC09 Acompanhar estado da triagem
```

Resultado:
Solicitação criada e enviada para análise.

---

# 3. Processo de Encaminhamento da Triagem

## Fluxo do processo

Processo executado pela recepcionista para direcionar o paciente.

Fluxo:

```text
UC26 Visualizar solicitações pendentes
↓
UC27 Analisar triagem
↓
UC28 Classificar prioridade
↓
UC29 Definir especialidade adequada
↓
UC30 Definir tipo de consulta
↓
UC31 Reencaminhar paciente
↓
UC32 Aprovar para agendamento
```

Resultado:
Paciente encaminhado para agendar com especialidade correta.

---

# 4. Processo de Agendamento após Triagem

## Fluxo do processo

Após encaminhamento, o paciente agenda a consulta.

Fluxo:

```text
UC10 Visualizar encaminhamento
↓
UC12 Agendar consulta após encaminhamento
↓
UC14 Consultar horários disponíveis
↓
UC15 Escolher profissional
↓
UC16 Confirmar agendamento
↓
UC22 Receber notificação de confirmação
```

Resultado:
Consulta agendada.

---

# 5. Processo de Agendamento Direto

## Fluxo do processo

Alternativa para pacientes que desejam agendar sem triagem.

Fluxo:

```text
UC02 Fazer login
↓
UC11 Realizar agendamento direto
↓
UC13 Escolher especialidade
↓
UC14 Consultar horários disponíveis
↓
UC15 Escolher profissional
↓
UC16 Confirmar agendamento
↓
UC22 Receber confirmação
```

Resultado:
Consulta agendada diretamente.

---

# 6. Processo de Reagendamento

## Fluxo do processo

Paciente altera data/horário de consulta existente.

Fluxo:

```text
UC17 Visualizar consultas agendadas
↓
UC18 Visualizar detalhes da consulta
↓
UC19 Reagendar consulta
↓
UC14 Consultar novos horários disponíveis
↓
UC15 Escolher novo horário/profissional
↓
UC16 Confirmar novo agendamento
```

Resultado:
Consulta reagendada.

Regra aplicada:

* permitido até 5 horas antes.

---

# 7. Processo de Cancelamento

## Fluxo do processo

Paciente cancela consulta marcada.

Fluxo:

```text
UC17 Visualizar consultas
↓
UC18 Ver detalhes
↓
UC20 Cancelar consulta
↓
UC25 Receber confirmação de cancelamento
```

Resultado:
Consulta cancelada e vaga liberada.

Regra:

* cancelamento apenas até 5 horas antes.

---

# 8. Processo de Gestão de Médicos (Administrador)

## Fluxo do processo

Preparação estrutural para permitir agendamentos.

Fluxo:

```text
UC43 Cadastrar especialidades
↓
UC40 Cadastrar médicos
↓
UC44 Definir disponibilidade
```

Resultado:
Especialidades e agendas configuradas.

---

# 9. Processo de Gestão Operacional da Recepcionista

## Fluxo do processo

Acompanhamento operacional das solicitações.

Fluxo:

```text
UC37 Acompanhar solicitações
↓
UC38 Visualizar agenda de consultas
↓
UC39 Gerir solicitações prioritárias
```

Resultado:
Fluxo operacional controlado.

---

# 10. Macro Fluxos Principais do Sistema

## Fluxo Principal A — Triagem Completa

```text
Cadastro
→ Login
→ Triagem
→ Encaminhamento
→ Agendamento
→ Consulta
```

---

## Fluxo Principal B — Agendamento Direto

```text
Cadastro
→ Login
→ Escolha da especialidade
→ Agendamento
→ Consulta
```

---

## Fluxo Principal C — Pós-agendamento

```text
Consulta agendada
→ Reagendar
ou
→ Cancelar
```

---

# 11. Dependências entre Processos

## Agendamento após triagem depende de:

* Processo de Triagem
* Processo de Encaminhamento

---

## Agendamento direto depende de:

* Processo de cadastro/login
* Processo de gestão de médicos

---

## Reagendamento depende de:

* Processo de agendamento já concluído

---

## Cancelamento depende de:

* Consulta previamente agendada
