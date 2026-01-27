---
name: skill-orchestrator
description: >
  Orquestador central de todas las habilidades disponibles. Usa este skill para:
  (1) Descubrir qué skills existen y cuándo usarlos,
  (2) Seleccionar el skill más apropiado para una tarea,
  (3) Combinar múltiples skills para tareas complejas,
  (4) Navegar el catálogo completo de 240+ habilidades organizadas por categoría.
  Invócalo cuando no estés seguro de qué skill usar o necesites una visión general de las capacidades disponibles.
---

# Skill Orchestrator

**Rol**: Directorio central y sistema de enrutamiento para todas las habilidades disponibles.

## Propósito

Este skill actúa como el **índice maestro** de todas las habilidades disponibles en la biblioteca. Utilízalo para:

1. **Descubrir** qué skills existen para una tarea específica
2. **Seleccionar** el skill más apropiado basándote en el contexto
3. **Combinar** múltiples skills para flujos de trabajo complejos
4. **Aprender** sobre las capacidades especializadas disponibles

---

## Cómo Usar Este Skill

### Flujo de Decisión

```
¿Sé exactamente qué skill necesito?
├── SÍ → Invócalo directamente: @nombre-del-skill
└── NO → Continúa leyendo el catálogo por categoría
```

### Invocación de Skills

Los skills se invocan con el prefijo `@` seguido del nombre:

```
@brainstorming diseña una aplicación de tareas
@systematic-debugging investiga por qué falla el login
@react-best-practices revisa este componente
```

---

## 📚 Catálogo de Skills por Categoría

### 🎨 Diseño Creativo y UI/UX

Skills para diseño visual, interfaces de usuario y creación artística.

| Skill | Descripción |
|-------|-------------|
| `@3d-web-experience` | Experiencias 3D interactivas para web |
| `@algorithmic-art` | Arte algorítmico con p5.js |
| `@canvas-design` | Diseño de pósters y arte visual (PNG/PDF) |
| `@frontend-design` | Interfaces frontend production-grade |
| `@interactive-portfolio` | Portafolios web interactivos |
| `@mobile-design` | Diseño de aplicaciones móviles |
| `@scroll-experience` | Experiencias de scroll animadas |
| `@theme-factory` | Generador de temas para documentos |
| `@ui-ux-pro-max` | Diseño UI/UX profesional completo |
| `@web-artifacts-builder` | Aplicaciones web modernas (React, Tailwind) |
| `@web-design-guidelines` | Guías de diseño web |

---

### 💻 Desarrollo Frontend

Skills para desarrollo de interfaces y aplicaciones cliente.

| Skill | Descripción |
|-------|-------------|
| `@frontend-dev-guidelines` | Guías de desarrollo frontend |
| `@javascript-mastery` | Dominio avanzado de JavaScript |
| `@nextjs-best-practices` | Mejores prácticas para Next.js |
| `@react-best-practices` | Patrones modernos de React |
| `@react-patterns` | Patrones de diseño en React |
| `@react-ui-patterns` | Componentes UI reutilizables |
| `@remotion-best-practices` | Videos programáticos con Remotion |
| `@tailwind-patterns` | Patrones de diseño con Tailwind CSS |
| `@typescript-expert` | Desarrollo avanzado en TypeScript |

---

### 🔧 Desarrollo Backend

Skills para desarrollo del lado del servidor y APIs.

| Skill | Descripción |
|-------|-------------|
| `@api-patterns` | Patrones de diseño de APIs |
| `@api-documentation-generator` | Generador de documentación de APIs |
| `@backend-dev-guidelines` | Guías de desarrollo backend |
| `@bullmq-specialist` | Colas de trabajo con BullMQ |
| `@bun-development` | Desarrollo con Bun runtime |
| `@graphql` | APIs con GraphQL |
| `@nestjs-expert` | Framework NestJS |
| `@nodejs-best-practices` | Mejores prácticas Node.js |
| `@python-patterns` | Patrones de Python |

---

### 🗄️ Bases de Datos

Skills para diseño, optimización y gestión de datos.

| Skill | Descripción |
|-------|-------------|
| `@database-design` | Diseño de esquemas de BD |
| `@neon-postgres` | Postgres serverless con Neon |
| `@nosql-expert` | Bases de datos NoSQL |
| `@postgres-best-practices` | Optimización de PostgreSQL |
| `@prisma-expert` | ORM Prisma |

---

### ☁️ Cloud y DevOps

Skills para despliegue, infraestructura y operaciones.

| Skill | Descripción |
|-------|-------------|
| `@aws-serverless` | Arquitectura serverless en AWS |
| `@azure-functions` | Azure Functions |
| `@docker-expert` | Contenedores y Docker |
| `@gcp-cloud-run` | Google Cloud Run |
| `@github-workflow-automation` | Automatización con GitHub Actions |
| `@server-management` | Administración de servidores |
| `@vercel-deployment` | Despliegue en Vercel |

---

### 🤖 Inteligencia Artificial y Agentes

Skills para desarrollo de aplicaciones con IA.

| Skill | Descripción |
|-------|-------------|
| `@agent-evaluation` | Evaluación de agentes de IA |
| `@agent-manager-skill` | Gestión de agentes |
| `@agent-memory-mcp` | Memoria persistente para agentes |
| `@agent-memory-systems` | Sistemas de memoria para IA |
| `@agent-tool-builder` | Constructor de herramientas para agentes |
| `@ai-agents-architect` | Arquitectura de agentes de IA |
| `@ai-product` | Productos basados en IA |
| `@ai-wrapper-product` | Wrappers sobre APIs de IA |
| `@autonomous-agent-patterns` | Patrones de agentes autónomos |
| `@autonomous-agents` | Desarrollo de agentes autónomos |
| `@computer-use-agents` | Agentes que usan la computadora |
| `@crewai` | Framework CrewAI |
| `@langgraph` | Grafos de agentes con LangGraph |
| `@llm-app-patterns` | Patrones para apps con LLMs |
| `@parallel-agents` | Agentes ejecutándose en paralelo |
| `@prompt-caching` | Caché de prompts |
| `@prompt-engineer` | Ingeniería de prompts |
| `@prompt-engineering` | Diseño avanzado de prompts |
| `@prompt-library` | Biblioteca de prompts |
| `@rag-engineer` | Sistemas RAG |
| `@rag-implementation` | Implementación de RAG |
| `@voice-agents` | Agentes de voz |
| `@voice-ai-development` | Desarrollo de IA de voz |
| `@voice-ai-engine-development` | Motores de IA de voz |

---

### 🧪 Testing y Calidad

Skills para pruebas, debugging y revisión de código.

| Skill | Descripción |
|-------|-------------|
| `@code-review-checklist` | Checklist de revisión de código |
| `@codex-review` | Revisión automatizada de código |
| `@playwright-skill` | Testing con Playwright |
| `@receiving-code-review` | Recibir feedback de revisiones |
| `@requesting-code-review` | Solicitar revisiones de código |
| `@systematic-debugging` | Debugging metódico |
| `@tdd-workflow` | Flujo TDD |
| `@test-driven-development` | Desarrollo guiado por tests |
| `@test-fixing` | Corrección de tests fallidos |
| `@testing-patterns` | Patrones de testing |
| `@verification-before-completion` | Verificación antes de completar |
| `@webapp-testing` | Testing de aplicaciones web |

---

### 🔒 Seguridad y Pentesting

Skills para seguridad ofensiva y defensiva.

| Skill | Descripción |
|-------|-------------|
| `@active-directory-attacks` | Ataques a Active Directory |
| `@api-fuzzing-bug-bounty` | Fuzzing de APIs para bug bounty |
| `@api-security-best-practices` | Seguridad de APIs |
| `@aws-penetration-testing` | Pentesting en AWS |
| `@broken-authentication` | Vulnerabilidades de autenticación |
| `@burp-suite-testing` | Testing con Burp Suite |
| `@cloud-penetration-testing` | Pentesting en la nube |
| `@ethical-hacking-methodology` | Metodología de hacking ético |
| `@file-path-traversal` | Path traversal |
| `@file-uploads` | Seguridad en uploads |
| `@html-injection-testing` | Testing de inyección HTML |
| `@idor-testing` | Testing de IDOR |
| `@linux-privilege-escalation` | Escalación de privilegios Linux |
| `@metasploit-framework` | Framework Metasploit |
| `@pentest-checklist` | Checklist de pentesting |
| `@pentest-commands` | Comandos de pentesting |
| `@privilege-escalation-methods` | Métodos de escalación |
| `@red-team-tactics` | Tácticas de Red Team |
| `@red-team-tools` | Herramientas de Red Team |
| `@scanning-tools` | Herramientas de escaneo |
| `@shodan-reconnaissance` | Reconocimiento con Shodan |
| `@smtp-penetration-testing` | Pentesting SMTP |
| `@sql-injection-testing` | Testing de SQL injection |
| `@sqlmap-database-pentesting` | Pentesting con SQLMap |
| `@ssh-penetration-testing` | Pentesting SSH |
| `@top-web-vulnerabilities` | Top vulnerabilidades web |
| `@vulnerability-scanner` | Escáner de vulnerabilidades |
| `@windows-privilege-escalation` | Escalación en Windows |
| `@wireshark-analysis` | Análisis con Wireshark |
| `@wordpress-penetration-testing` | Pentesting WordPress |
| `@xss-html-injection` | XSS e inyección HTML |

---

### 📝 Documentación y Office

Skills para trabajo con documentos y archivos de oficina.

| Skill | Descripción |
|-------|-------------|
| `@doc-coauthoring` | Co-autoría de documentos |
| `@docx-official` | Documentos Word (.docx) |
| `@documentation-templates` | Plantillas de documentación |
| `@pdf-official` | Manipulación de PDFs |
| `@pptx-official` | Presentaciones PowerPoint |
| `@xlsx-official` | Hojas de cálculo Excel |

---

### 📋 Planificación y Workflow

Skills para gestión de tareas y flujos de trabajo.

| Skill | Descripción |
|-------|-------------|
| `@brainstorming` | Diseñar antes de implementar |
| `@concise-planning` | Planificación concisa |
| `@executing-plans` | Ejecución de planes |
| `@kaizen` | Mejora continua |
| `@multi-agent-brainstorming` | Brainstorming con múltiples agentes |
| `@plan-writing` | Escritura de planes |
| `@planning-with-files` | Planificación basada en archivos |
| `@writing-plans` | Redacción de planes de implementación |

---

### 🔌 Integraciones y APIs

Skills para integrar servicios externos.

| Skill | Descripción |
|-------|-------------|
| `@algolia-search` | Búsqueda con Algolia |
| `@analytics-tracking` | Tracking analítico |
| `@clerk-auth` | Autenticación con Clerk |
| `@exa-search` | Búsqueda con Exa |
| `@firebase` | Firebase de Google |
| `@firecrawl-scraper` | Web scraping con Firecrawl |
| `@hubspot-integration` | Integración con HubSpot |
| `@inngest` | Background jobs con Inngest |
| `@langfuse` | Observabilidad para LLMs |
| `@nextjs-supabase-auth` | Auth con Next.js y Supabase |
| `@plaid-fintech` | APIs financieras con Plaid |
| `@segment-cdp` | Customer Data Platform |
| `@stripe-integration` | Pagos con Stripe |
| `@trigger-dev` | Jobs en background |
| `@twilio-communications` | Comunicaciones con Twilio |
| `@upstash-qstash` | Colas con Upstash |

---

### 🛠️ Extensión del Sistema

Skills para extender capacidades del agente.

| Skill | Descripción |
|-------|-------------|
| `@browser-automation` | Automatización del navegador |
| `@browser-extension-builder` | Extensiones de navegador |
| `@context-window-management` | Gestión de ventana de contexto |
| `@dispatching-parallel-agents` | Dispatch de agentes paralelos |
| `@mcp-builder` | Constructor de servidores MCP |
| `@personal-tool-builder` | Herramientas personales |
| `@skill-creator` | Crear nuevos skills |
| `@skill-developer` | Desarrollar skills |
| `@subagent-driven-development` | Desarrollo con sub-agentes |
| `@using-superpowers` | Uso de superpoderes |
| `@writing-skills` | Escribir y validar skills |

---

### 📈 Marketing y SEO

Skills para marketing digital y optimización.

| Skill | Descripción |
|-------|-------------|
| `@ab-test-setup` | Configuración de A/B tests |
| `@app-store-optimization` | ASO para app stores |
| `@competitor-alternatives` | Análisis de competencia |
| `@email-sequence` | Secuencias de email |
| `@email-systems` | Sistemas de email |
| `@form-cro` | Optimización de formularios |
| `@free-tool-strategy` | Estrategia de herramientas gratuitas |
| `@launch-strategy` | Estrategia de lanzamiento |
| `@marketing-ideas` | Ideas de marketing |
| `@marketing-psychology` | Psicología del marketing |
| `@onboarding-cro` | Optimización de onboarding |
| `@page-cro` | Optimización de páginas |
| `@paid-ads` | Publicidad pagada |
| `@paywall-upgrade-cro` | Optimización de paywall |
| `@popup-cro` | Optimización de popups |
| `@pricing-strategy` | Estrategia de precios |
| `@programmatic-seo` | SEO programático |
| `@referral-program` | Programas de referidos |
| `@schema-markup` | Marcado Schema.org |
| `@seo-audit` | Auditoría SEO |
| `@seo-fundamentals` | Fundamentos de SEO |
| `@signup-flow-cro` | Optimización de registro |
| `@social-content` | Contenido para redes |
| `@viral-generator-builder` | Generadores virales |

---

### ✍️ Escritura y Contenido

Skills para creación de contenido.

| Skill | Descripción |
|-------|-------------|
| `@content-creator` | Creación de contenido |
| `@copy-editing` | Edición de textos |
| `@copywriting` | Copywriting persuasivo |
| `@daily-news-report` | Informes de noticias |
| `@internal-comms-anthropic` | Comunicaciones internas (Anthropic) |
| `@internal-comms-community` | Comunicaciones internas (comunidad) |
| `@research-engineer` | Investigación técnica |

---

### 🏗️ Arquitectura y Patrones

Skills para diseño de sistemas a gran escala.

| Skill | Descripción |
|-------|-------------|
| `@architecture` | Patrones de arquitectura |
| `@cc-skill-backend-patterns` | Patrones backend |
| `@cc-skill-frontend-patterns` | Patrones frontend |
| `@clean-code` | Código limpio |
| `@production-code-audit` | Auditoría de código productivo |
| `@senior-architect` | Arquitectura senior |
| `@senior-fullstack` | Desarrollo fullstack senior |
| `@software-architecture` | Arquitectura de software |

---

### 🎮 Desarrollo de Juegos

Skills para desarrollo de videojuegos.

| Skill | Descripción |
|-------|-------------|
| `@blockrun` | Juegos tipo runner |
| `@game-development` | Desarrollo de juegos |

---

### 🤖 Bots y Automatización

Skills para bots y automatización.

| Skill | Descripción |
|-------|-------------|
| `@discord-bot-architect` | Bots de Discord |
| `@slack-bot-builder` | Bots de Slack |
| `@slack-gif-creator` | GIFs para Slack |
| `@telegram-bot-builder` | Bots de Telegram |
| `@telegram-mini-app` | Mini apps de Telegram |
| `@workflow-automation` | Automatización de flujos |
| `@zapier-make-patterns` | Patrones Zapier/Make |

---

### 🐧 Linux y Shell

Skills para sistemas Linux y scripting.

| Skill | Descripción |
|-------|-------------|
| `@bash-linux` | Scripting en Bash |
| `@busybox-on-windows` | BusyBox en Windows |
| `@linux-shell-scripting` | Scripts de shell Linux |
| `@powershell-windows` | PowerShell en Windows |

---

### 🛒 E-commerce

Skills para comercio electrónico.

| Skill | Descripción |
|-------|-------------|
| `@shopify-apps` | Apps para Shopify |
| `@shopify-development` | Desarrollo en Shopify |

---

### 📚 Herramientas Específicas

Skills para herramientas y plataformas específicas.

| Skill | Descripción |
|-------|------------|
| `@claude-code-guide` | Guía de Claude Code |
| `@context7-auto-research` | Investigación automática |
| `@conversation-memory` | Memoria de conversación |
| `@git-pushing` | Commits con buenos mensajes |
| `@lint-and-validate` | Linting y validación |
| `@notebooklm` | NotebookLM de Google |
| `@notion-template-business` | Plantillas de Notion |
| `@obsidian-clipper-template-creator` | Templates para Obsidian |
| `@tavily-web` | Búsqueda web con Tavily |
| `@using-git-worktrees` | Git worktrees |

---

## 🎯 Skills Recomendados por Situación

### "Necesito empezar un proyecto nuevo"
→ `@brainstorming` → `@writing-plans` → `@senior-architect`

### "Tengo un bug difícil de resolver"
→ `@systematic-debugging`

### "Quiero mejorar mi código React"
→ `@react-best-practices` → `@clean-code`

### "Necesito crear documentación"
→ `@docx-official` o `@documentation-templates`

### "Quiero auditar la seguridad"
→ `@pentest-checklist` → `@ethical-hacking-methodology`

### "Quiero construir con IA"
→ `@ai-agents-architect` → `@prompt-engineer` → `@rag-implementation`

### "Necesito optimizar para SEO"
→ `@seo-fundamentals` → `@schema-markup` → `@programmatic-seo`

---

## Combinación de Skills

Para tareas complejas, combina múltiples skills secuencialmente:

```
1. @brainstorming → Diseña la solución
2. @writing-plans → Crea plan de implementación  
3. @senior-fullstack → Implementa el código
4. @test-driven-development → Escribe tests
5. @verification-before-completion → Verifica todo
```

---

## Nota Final

Este catálogo contiene **240+ skills** organizados por categoría. Si no encuentras un skill específico, usa el sistema de archivos para buscar en el directorio `skills/`:

```bash
ls skills/ | grep "palabra-clave"
```

O simplemente pregunta: *"¿Existe un skill para [tarea específica]?"*
