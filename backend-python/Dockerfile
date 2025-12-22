FROM python:3.11-slim

WORKDIR /app

# מעתיקים את תעודת NetFree
COPY netfree-ca-bundle-curl.crt /usr/local/share/ca-certificates/netfree.crt

# רושמים אותה במערכת
RUN update-ca-certificates

# מגדירים ל-Python ול-pip להשתמש בה
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt

COPY requirements.txt .



# Clear proxy environment variables to avoid proxy issues during pip install
ENV http_proxy=""
ENV https_proxy=""
ENV HTTP_PROXY=""
ENV HTTPS_PROXY=""

# Remove any pip.conf that may set a proxy
RUN rm -f /etc/pip.conf ~/.pip/pip.conf || true

# Unset proxy environment variables before pip install
RUN unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY && \
	pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["/bin/sh", "-c", "unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY; python app.py"]
