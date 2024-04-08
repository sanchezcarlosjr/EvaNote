# EvaNote

Web-based reactive computing platform

## Getting Started

### Environment and settings
```.env.*.example``` files shows how you should write ```.env.*.local``` files. The latter are ignored by Git. Similarly, ```public/settings/service_registries.*``` files and ```public/settings/settings.*```  files allow you to define different settings and service registries by environment. These files are loaded at execution time using a template engine and Browser JSON Parser.

## Available Scripts

## Clone
```
git submodule update --init --recursive
```

### Running the development server.

```bash
    npm run dev
```

### Building for production.

```bash
    npm run build
```



### Running the production server.

```bash
    npm run start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **Supabase Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Material UI** [Docs](https://refine.dev/docs/ui-frameworks/mui/tutorial/)
- **Inferencer** [Docs](https://refine.dev/docs/packages/documentation/inferencer)
- **i18n** [Docs](https://refine.dev/docs/core/providers/i18n-provider/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)

## License

MIT
