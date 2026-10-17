# Constitución — habits-cli

Principios innegociables. Toda especificación, plan y tarea debe cumplirlos.

1. **Simplicidad primero**: TypeScript estricto ejecutado con Bun. Solo se permite el uso de la API nativa de Bun y Node.js en la aplicación. Prohibido añadir dependencias externas en el `package.json` (Bun ya incluye su propio ejecutor de pruebas de alto rendimiento de forma nativa).
2. **La spec manda**: ningún comportamiento se implementa si no está en la spec activa. Si falta una decisión, se detiene el trabajo y se pregunta.
3. **Lógica separada de interfaz**: el núcleo (`core`) no imprime por consola (`console.log`) ni lee entradas del sistema. La CLI es una capa fina. Todo el core es 100% testeable de forma aislada sin la CLI.
4. **Tests como puerta**: cada tarea termina con sus tests en verde ejecutando `bun test`. Prohibido avanzar o dar por terminada una tarea con tests en rojo.
5. **Datos locales y transparentes**: persistencia en un único archivo JSON legible mediante los módulos nativos de sistema de archivos. Nada de bases de datos externas ni peticiones de red.
6. **Idioma y Tipado**: código, tipos e identificadores estrictamente en inglés. Queda completamente prohibido el uso de `any` (utilizar tipos explícitos, genéricos o `unknown` con validación manual). Mensajes dirigidos al usuario y documentación siempre en español.
