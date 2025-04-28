# 使用官方的 Nginx 基础镜像
FROM nginx:1.21

# 删除 Nginx 默认的配置文件
RUN rm /etc/nginx/conf.d/default.conf

# 将本地的 Nginx 配置文件复制到容器内
COPY nginx.conf /etc/nginx/conf.d/

# 将 Vue 项目构建后的静态文件复制到 Nginx 的默认静态文件目录
COPY dist/ /usr/share/nginx/html/

# 暴露容器的 80 端口
EXPOSE 80

# 启动 Nginx 服务
CMD ["nginx", "-g", "daemon off;"]    