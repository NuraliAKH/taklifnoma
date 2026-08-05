# Production configuration

## Upload limit (nginx)

The public site proxies `/api/` through nginx. Nginx defaults to a 1 MB request
body limit and returns `413 Content Too Large` before NestJS receives the file.

Install the checked-in snippet on the server and include it in the
`web-taklifnoma.uz` server block:

```nginx
server {
    # Existing TLS, frontend and proxy configuration...
    include /home/nurali/www/taklifnoma/ops/nginx/upload-limits.conf;
}
```

Then validate and reload nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

The configured limit is 100 MB. The NestJS upload interceptor enforces the same
limit, so requests larger than that still receive an intentional HTTP 413.

If Cloudflare proxies the domain, its plan-level upload limit also applies. A
file larger than that limit must use a DNS-only upload hostname or direct object
storage upload; changing nginx alone cannot raise Cloudflare's limit.
