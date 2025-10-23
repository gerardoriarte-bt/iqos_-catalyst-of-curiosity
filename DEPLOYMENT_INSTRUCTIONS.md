# 🚀 IQOS Catalyst - Instrucciones de Despliegue

## 📋 Resumen de Configuración

- **Servidor**: 18.219.75.63 (EC2 AWS)
- **Dominio**: iqos.buentipo.com
- **Archivo PEM**: iqos.pem (ubicado en `/Users/buentipo/Documents/GitHub/iqos_catalyst-of-curiosity/iqos.pem`)
- **Puerto**: 3000 (aplicación) + 80/443 (Nginx)

## 🚀 Pasos para Desplegar

### 1. **Despliegue Inicial**
```bash
cd /Users/buentipo/Documents/GitHub/iqos_catalyst-of-curiosity
./deploy-production.sh
```

### 2. **Configurar SSL**
```bash
./setup-ssl.sh
```

### 3. **Verificar Despliegue**
```bash
./diagnose-deployment.sh
```

## 🌐 URLs de Acceso

- **HTTP (IP)**: http://18.219.75.63
- **HTTPS (Dominio)**: https://iqos.buentipo.com

## 🔧 Comandos de Mantenimiento

### **Ver Estado de la Aplicación**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 status'
```

### **Ver Logs**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 logs iqos-catalyst'
```

### **Reiniciar Aplicación**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 restart iqos-catalyst'
```

### **Conectar al Servidor**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63
```

## 📊 Verificación de DNS

Antes del despliegue, asegúrate de que tu dominio apunte a la IP del servidor:

```bash
# Verificar DNS
nslookup iqos.buentipo.com
dig iqos.buentipo.com
```

## 🔒 Configuración SSL

El certificado SSL se configura automáticamente con Let's Encrypt. Si necesitas configurarlo manualmente:

```bash
ssh -i iqos.pem ubuntu@18.219.75.63
sudo certbot --nginx -d iqos.buentipo.com
```

## 🚨 Solución de Problemas

### **Error 502 Bad Gateway**
```bash
./diagnose-deployment.sh
```

### **Aplicación no responde**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63 'pm2 restart iqos-catalyst'
```

### **Problemas de SSL**
```bash
ssh -i iqos.pem ubuntu@18.219.75.63 'sudo certbot renew'
```

## 📁 Archivos de Configuración

- `deploy-production.sh` - Script principal de despliegue
- `setup-ssl.sh` - Configuración de SSL
- `diagnose-deployment.sh` - Diagnóstico del sistema
- `iqos.pem` - Clave privada para conexión SSH

## ✅ Checklist Pre-Despliegue

- [ ] Archivo `iqos.pem` en el directorio raíz
- [ ] Dominio `iqos.buentipo.com` apunta a `18.219.75.63`
- [ ] Variables de entorno configuradas
- [ ] Build del proyecto exitoso
- [ ] Conexión SSH al servidor funcional

---

**¡El proyecto está listo para producción!** 🎉
