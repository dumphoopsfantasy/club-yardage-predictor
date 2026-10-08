# Architecture rules
- Keep presentation changes in screen components and semantic theme styles; never couple visual redesigns to catalog or prediction code, so calculations stay independently stable.
- Use the shared Button with its unstyled variant for bespoke screen controls, so accessible sizing and interaction behavior stay centralized.
- Use a searchable dialog for catalog model selection, so long manufacturer catalogs remain usable on narrow screens without changing catalog data.
- Keep tab screens mounted while hiding inactive screens, so switching views and themes preserves calculator input state.