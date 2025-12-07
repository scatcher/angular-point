# Changelog

All notable changes to this project will be documented in this file.

## [6.5.4] - 2025-12-07

### Fixed

- **Orphaned Lookup Handling**: Modified `jsLookup` and `jsLookupMulti` in `apDecodeService.ts` to filter out orphaned lookups (lookups with an ID but empty `lookupValue`). This occurs when a referenced SharePoint item is deleted - SharePoint clears the lookup display value but keeps the ID (e.g., `"18611;#"` instead of `"18611;#ItemTitle"`). Previously, these orphaned lookups would cause runtime errors when code attempted to access properties on non-existent cached entities. Now:
  - `jsLookup` returns `null` for orphaned lookups instead of a Lookup object with empty `lookupValue`
  - `jsLookupMulti` filters out orphaned lookups from the returned array

## [6.5.3] and earlier

- See git history for changes prior to this changelog.

