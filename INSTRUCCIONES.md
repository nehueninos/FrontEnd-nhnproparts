# Plataforma de Venta de Accesorios de Moto

Tu tienda online está lista. Aquí está todo lo que necesitas saber:

## Características Implementadas

### 1. Catálogo de Productos
- Productos organizados por categorías (Cascos, Guantes, Ropa, Calzado, Seguridad, Accesorios)
- Filtrado por categoría
- Imágenes de alta calidad desde Pexels
- Indicadores de stock disponible
- 6 productos de ejemplo ya cargados en la base de datos

### 2. Carrito de Compras
- Agregar productos al carrito
- Ajustar cantidades
- Ver total en tiempo real
- Remover productos

### 3. Proceso de Checkout
- Formulario para datos del cliente (nombre, email, teléfono, dirección)
- Resumen del pedido
- Información de métodos de pago disponibles

### 4. Notificaciones por Email
- Cuando un cliente hace un pedido, recibirás un email automático con:
  - Número de pedido
  - Datos del cliente
  - Lista de productos y cantidades
  - Total del pedido
  - Recordatorio para contactar al cliente

### 5. Integración con WhatsApp
- Botón flotante siempre visible para que clientes te contacten
- Después de confirmar un pedido, el cliente es redirigido automáticamente a WhatsApp con un mensaje pre-escrito

### 6. Panel de Administración
- Acceso seguro con autenticación (email/contraseña)
- Crear nuevos productos fácilmente
- Editar productos existentes (nombre, precio, descripción, stock, imagen)
- Eliminar productos del catálogo
- Visualizar stock en tiempo real con indicadores de color
- Buscar y filtrar productos
- Vista de tabla intuitiva con todas las acciones disponibles

## Configuración Necesaria

### Paso 1: Actualizar tu WhatsApp
Abre el archivo \`src/App.tsx\` y cambia esta línea (línea 9):

\`\`\`typescript
const SHOP_WHATSAPP = '5215512345678';  // Cambia esto por tu número de WhatsApp
\`\`\`

Formato del número: código de país + número sin espacios ni guiones
Ejemplo: '5215551234567' para México

### Paso 2: Configurar tu Email
En el mismo archivo \`src/App.tsx\`, cambia esta línea (línea 10):

\`\`\`typescript
const SHOP_EMAIL = 'tu-email@gmail.com';  // Cambia esto por tu Gmail
\`\`\`

### Paso 3: Configurar Resend para recibir emails

Para que te lleguen los emails cuando alguien haga un pedido:

1. Ve a [https://resend.com](https://resend.com) y crea una cuenta gratuita
2. Verifica tu email
3. En el dashboard de Resend, ve a "API Keys"
4. Crea una nueva API Key y cópiala
5. Configura la variable de entorno \`RESEND_API_KEY\` con tu clave

**Importante sobre Resend:**
- El plan gratuito permite 3,000 emails al mes
- Para enviar a tu Gmail personal, necesitas verificar tu dominio O usar el dominio de prueba de Resend
- Si usas el dominio de prueba (\`onboarding@resend.dev\`), los emails podrían llegar a spam

## Cómo Funciona el Flujo de Compra

1. Cliente navega el catálogo y agrega productos al carrito
2. Cliente hace clic en el carrito y luego en "Proceder al Pago"
3. Cliente llena sus datos (nombre, email, teléfono, dirección)
4. Cliente confirma el pedido
5. Sistema guarda el pedido en la base de datos
6. Sistema envía email a tu Gmail con los detalles del pedido
7. Cliente es redirigido automáticamente a WhatsApp contigo
8. Tú coordinas el pago y entrega por WhatsApp

## Métodos de Pago

La plataforma muestra estas opciones de pago (puedes personalizarlas en \`src/components/CheckoutModal.tsx\`):

- Transferencia Bancaria
- Depósito en Sucursal
- Pago en Efectivo (contra entrega)

Tú coordinas el pago real con el cliente por WhatsApp después de que haga el pedido.

## Panel de Administración

### Acceso al Panel
1. Una vez que estés logueado como usuario, verás un botón "Admin" en la esquina superior derecha del header
2. Haz clic en él para acceder al panel de administración
3. Si es la primera vez, necesitarás registrarte con tu email

### Primeros Pasos de Admin
**Importante**: El primer admin debe ser configurado manualmente. Una vez que te registres, contacta a un administrador existente (o accede directamente a Supabase) para:

1. Ir a Supabase Console
2. Abrir la tabla `admin_users`
3. Insertar una fila con tu `user_id` de auth.users y tu email

```sql
INSERT INTO admin_users (id, email)
VALUES ('tu-user-id-de-auth', 'tu-email@ejemplo.com');
```

### Usar el Panel Admin
Una vez que tengas acceso:

1. **Ver Productos**: La tabla muestra todos tus productos con su imagen, nombre, categoría, precio y stock actual
2. **Agregar Producto**: Haz clic en "Nuevo Producto" y rellena el formulario:
   - Nombre
   - Descripción
   - Categoría (Cascos, Guantes, Ropa, Calzado, Seguridad, Accesorios)
   - Precio
   - Stock (cantidad disponible)
   - URL de imagen (de Pexels.com u otro sitio)

3. **Editar Producto**: Haz clic en "Editar" al lado del producto para cambiar cualquier información

4. **Eliminar Producto**: Haz clic en "Eliminar" para remover un producto del catálogo

5. **Buscar**: Usa la barra de búsqueda para filtrar productos por nombre o categoría

### Indicadores de Stock
- Verde: Más de 5 unidades disponibles
- Amarillo: Entre 1 y 5 unidades
- Rojo: Sin stock (0 unidades)

### Cerrar Sesión
Haz clic en "Cerrar Sesión" en el panel admin para salir y volver a la tienda

## Base de Datos

Tu base de datos Supabase tiene 4 tablas:

1. **products** - Catálogo de productos
2. **orders** - Pedidos de clientes
3. **order_items** - Detalle de productos en cada pedido
4. **admin_users** - Usuarios con permisos de administrador

## Configuración Inicial del Admin

Para que el panel de administración funcione correctamente, necesitas:

### 1. Crear tu Usuario Admin
- Abre la tienda en tu navegador
- Haz clic en el botón "Admin" (aparecerá si logueado)
- Haz clic en "Regístrate" si es la primera vez
- Crea una cuenta con tu email y contraseña

### 2. Otorgate Permisos de Admin
- Accede a tu proyecto en [Supabase Console](https://app.supabase.com)
- En la sección SQL, ejecuta este comando:

```sql
-- Reemplaza 'tu-email@ejemplo.com' con tu email real
INSERT INTO admin_users (id, email)
SELECT id, email FROM auth.users WHERE email = 'tu-email@ejemplo.com';
```

Después de esto, recarga la página y ya tendrás acceso completo al panel admin.

## Seguridad

- El panel admin requiere autenticación obligatoria
- Solo los usuarios en la tabla `admin_users` pueden acceder
- Los clientes regularmente no pueden acceder al panel
- Todos los cambios de productos requieren estar logueado como admin

## Soporte

Si necesitas ayuda o quieres agregar más funcionalidades, solo pídelo.
