# 🚨 SOLUCIÓN INMEDIATA - Problema 502 Bad Gateway

## 🔍 **Diagnóstico Completo**

### ✅ **Lo que SÍ funciona:**
- ✅ DNS: `iqos.buentipo.com` → `18.219.75.63`
- ✅ SSL: Certificado válido hasta enero 2026
- ✅ Nginx: Funcionando correctamente
- ✅ Build: Aplicación compilada exitosamente
- ✅ Paquete: `iqos-catalyst-production.tar.gz` listo

### ❌ **El problema:**
- ❌ **Error 502 Bad Gateway**: La aplicación Node.js no está ejecutándose
- ❌ **SSH bloqueado**: No podemos conectarnos para reiniciar la aplicación

## 🚀 **SOLUCIONES INMEDIATAS**

### **Opción 1: AWS Console (Más Rápida)**

1. **Ve a AWS EC2 Console**
2. **Busca la instancia** `18.219.75.63`
3. **Verifica que esté corriendo**
4. **Usa "Connect" → "Session Manager"** (si está habilitado)
5. **O usa "Connect" → "EC2 Instance Connect"**

### **Opción 2: Verificar/Corregir Clave PEM**

1. **Descarga la clave correcta** desde AWS Console
2. **O verifica que `iqos.pem` sea la correcta**
3. **Reemplaza el archivo** si es necesario

### **Opción 3: Reiniciar Instancia**

1. **En AWS Console, reinicia la instancia**
2. **Espera a que arranque**
3. **Verifica si la aplicación se inicia automáticamente**

## 🔧 **COMANDOS PARA PROBAR**

### **Probar conexión SSH:**
```bash
# Probar con diferentes usuarios
ssh -i iqos.pem ubuntu@18.219.75.63
ssh -i iqos.pem ec2-user@18.219.75.63
ssh -i iqos.pem admin@18.219.75.63
```

### **Si SSH funciona, ejecutar:**
```bash
# Verificar estado de PM2
pm2 status

# Reiniciar aplicación
pm2 restart iqos-catalyst

# Ver logs
pm2 logs iqos-catalyst
```

## 📋 **PASOS RECOMENDADOS**

### **1. Verificar AWS Console (5 minutos)**
- Instancia corriendo ✅
- Key pair correcto ✅
- Security groups (puertos 22, 80, 443, 3000) ✅

### **2. Probar conexión SSH**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63
```

### **3. Si SSH funciona:**
```bash
# Subir archivos
scp -i iqos.pem iqos-catalyst-production.tar.gz ubuntu@18.219.75.63:/home/ubuntu/

# Conectar y desplegar
ssh -i iqos.pem ubuntu@18.219.75.63
tar -xzf iqos-catalyst-production.tar.gz
npm install --production
pm2 restart iqos-catalyst
```

### **4. Si SSH no funciona:**
- Usar AWS Systems Manager
- O EC2 Instance Connect
- O reiniciar la instancia

## 🎯 **RESULTADO ESPERADO**

Una vez solucionado, deberías ver:
- ✅ `https://iqos.buentipo.com` funcionando
- ✅ API `/api/health` respondiendo
- ✅ Aplicación IQOS Catalyst funcionando

## 🚨 **URGENTE**

El problema es que **la aplicación no está ejecutándose**. Una vez que puedas acceder al servidor (por cualquier método), la solución es simple:

```bash
pm2 restart iqos-catalyst
```

¿Quieres que te ayude con algún método específico de acceso al servidor?
