export interface ViewSpec {
  code: string;
  path: string;
  routePath: string;
  title: string;
  area: string;
  summary: string;
  accent: string;
}

export interface ViewGroup {
  title: string;
  description: string;
  views: readonly ViewSpec[];
}

export const VIEW_SPECS: readonly ViewSpec[] = [
  { code: 'V1', path: 'v1', routePath: 'access/v1', title: 'Dashboard Público', area: 'Acceso', summary: 'Pantalla de bienvenida con noticias, video introductorio y acceso al flujo público.', accent: '#4ecdc4' },
  { code: 'V2', path: 'v2', routePath: 'access/v2', title: 'Iniciar Sesión', area: 'Acceso', summary: 'Formulario de autenticación listo para conectar con Supabase Auth en la siguiente fase.', accent: '#5fb2ff' },
  { code: 'V3', path: 'v3', routePath: 'access/v3', title: 'Registro', area: 'Acceso', summary: 'Registro de estudiante y selección de programa académico para crear el perfil inicial.', accent: '#ff9f1c' },
  { code: 'V33', path: 'v33', routePath: 'access/v33', title: 'Recuperar Contraseña', area: 'Acceso', summary: 'Formulario para solicitar un enlace de recuperación de contraseña desde el acceso.', accent: '#8bd3ff' },
  { code: 'V4', path: 'v4', routePath: 'access/v4', title: 'Dashboard Privado', area: 'Acceso', summary: 'Hub privado con horario embebido, próxima clase y acceso al resto del sistema.', accent: '#8bd3ff' },
  { code: 'V5', path: 'v5', routePath: 'alerts/v5', title: 'Alertas', area: 'Horario', summary: 'Lista de clases y eventos próximos para el usuario autenticado.', accent: '#4ecdc4' },
  { code: 'V6', path: 'v6', routePath: 'alerts/v6', title: 'Configuración de Alertas', area: 'Horario', summary: 'Panel para definir cuánto antes avisar y cómo notificar al estudiante.', accent: '#5fb2ff' },
  { code: 'V7', path: 'v7', routePath: 'campus/v7', title: 'Directorio de Lugares', area: 'Campus', summary: 'Entrada al mapa de puntos de interés del campus con navegación a las vistas específicas.', accent: '#ff9f1c' },
  { code: 'V8', path: 'v8', routePath: 'campus/v8', title: 'Baños', area: 'Campus', summary: 'Vista placeholder para el punto de interés de baños.', accent: '#8bd3ff' },
  { code: 'V9', path: 'v9', routePath: 'campus/v9', title: 'Biblioteca', area: 'Campus', summary: 'Vista placeholder para la biblioteca institucional.', accent: '#4ecdc4' },
  { code: 'V10', path: 'v10', routePath: 'campus/v10', title: 'Cafetería / Restaurante', area: 'Campus', summary: 'Vista placeholder para alimentación y descanso.', accent: '#ff9f1c' },
  { code: 'V11', path: 'v11', routePath: 'campus/v11', title: 'Sendero Turístico', area: 'Campus', summary: 'Vista placeholder para el recorrido turístico del campus.', accent: '#5fb2ff' },
  { code: 'V12', path: 'v12', routePath: 'campus/v12', title: 'Gimnasio', area: 'Campus', summary: 'Vista placeholder para el gimnasio.', accent: '#4ecdc4' },
  { code: 'V13', path: 'v13', routePath: 'campus/v13', title: 'Bienestar Universitario', area: 'Campus', summary: 'Vista placeholder para servicios de bienestar.', accent: '#8bd3ff' },
  { code: 'V14', path: 'v14', routePath: 'campus/v14', title: 'Parqueadero', area: 'Campus', summary: 'Vista placeholder para parqueaderos y acceso vehicular.', accent: '#ff9f1c' },
  { code: 'V15', path: 'v15', routePath: 'campus/v15', title: 'Entrada / Salida', area: 'Campus', summary: 'Vista placeholder para los accesos principales.', accent: '#5fb2ff' },
  { code: 'V16', path: 'v16', routePath: 'campus/v16', title: 'Auditorio 1', area: 'Campus', summary: 'Vista placeholder para el auditorio 1.', accent: '#4ecdc4' },
  { code: 'V17', path: 'v17', routePath: 'campus/v17', title: 'Auditorio 2', area: 'Campus', summary: 'Vista placeholder para el auditorio 2.', accent: '#8bd3ff' },
  { code: 'V18', path: 'v18', routePath: 'campus/v18', title: 'Laboratorio 1', area: 'Campus', summary: 'Vista placeholder para el laboratorio 1.', accent: '#ff9f1c' },
  { code: 'V19', path: 'v19', routePath: 'campus/v19', title: 'Laboratorio 2', area: 'Campus', summary: 'Vista placeholder para el laboratorio 2.', accent: '#5fb2ff' },
  { code: 'V20', path: 'v20', routePath: 'campus/v20', title: 'Invernaderos', area: 'Campus', summary: 'Vista placeholder para invernaderos y zonas verdes.', accent: '#4ecdc4' },
  { code: 'V21', path: 'v21', routePath: 'schedule/v21', title: 'Ingreso Manual', area: 'Horario', summary: 'Formulario reactivo para cargar horarios a mano en la versión base.', accent: '#ff9f1c' },
  { code: 'V22', path: 'v22', routePath: 'schedule/v22', title: 'Escanear PDF', area: 'Horario', summary: 'Vista placeholder para la carga de horarios desde archivos PDF.', accent: '#5fb2ff' },
  { code: 'V23', path: 'v23', routePath: 'schedule/v23', title: 'Escanear Imagen', area: 'Horario', summary: 'Vista placeholder para capturar o elegir imágenes de horario.', accent: '#4ecdc4' },
  { code: 'V24', path: 'v24', routePath: 'schedule/v24', title: 'Gestor de Horario', area: 'Horario', summary: 'Centro de operaciones del horario, preparado para CRUD y sincronización.', accent: '#8bd3ff' },
  { code: 'V25', path: 'v25', routePath: 'campus/v25', title: 'Navegación en Tiempo Real', area: 'Campus', summary: 'Vista placeholder para mapas, ruta activa y asistencia de navegación.', accent: '#ff9f1c' },
  { code: 'V26', path: 'v26', routePath: 'settings/v26', title: 'Configuraciones Generales', area: 'Configuración', summary: 'Hub principal para ajustes generales y opciones de cuenta.', accent: '#5fb2ff' },
  { code: 'V27', path: 'v27', routePath: 'settings/v27', title: 'Tamaño de Letra', area: 'Configuración', summary: 'Vista placeholder para ajustar la escala tipográfica.', accent: '#4ecdc4' },
  { code: 'V28', path: 'v28', routePath: 'settings/v28', title: 'Sonido de Alarma', area: 'Configuración', summary: 'Vista placeholder para seleccionar tonos de alerta.', accent: '#ff9f1c' },
  { code: 'V29', path: 'v29', routePath: 'settings/v29', title: 'Notificaciones', area: 'Configuración', summary: 'Vista placeholder para activar o desactivar notificaciones.', accent: '#8bd3ff' },
  { code: 'V30', path: 'v30', routePath: 'settings/v30', title: 'Color de la App', area: 'Configuración', summary: 'Vista placeholder para cambiar el tema visual.', accent: '#4ecdc4' },
  { code: 'V31', path: 'v31', routePath: 'settings/v31', title: 'Licencias Open Source', area: 'Configuración', summary: 'Vista placeholder para el detalle de licencias de terceros.', accent: '#5fb2ff' }
];

const viewByCode = new Map(VIEW_SPECS.map((view) => [view.code, view]));

function pickViews(...codes: string[]): ViewSpec[] {
  return codes.map((code) => viewByCode.get(code)).filter((view): view is ViewSpec => Boolean(view));
}

export const VIEW_GROUPS: readonly ViewGroup[] = [
  { title: 'Acceso', description: 'V1 a V4 y V33', views: pickViews('V1', 'V2', 'V3', 'V33', 'V4') },
  { title: 'Horario', description: 'V5, V6 y V21-V24', views: pickViews('V5', 'V6', 'V21', 'V22', 'V23', 'V24') },
  { title: 'Campus', description: 'V7 a V20 y V25', views: pickViews('V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20', 'V25') },
  { title: 'Configuración', description: 'V26 a V31', views: pickViews('V26', 'V27', 'V28', 'V29', 'V30', 'V31') }
];