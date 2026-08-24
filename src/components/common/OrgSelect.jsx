import { useState, useEffect } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Label } from "@/components/ui/label";
import { useOrgs } from "@/hooks/useOrgs";
import { useLanguage } from "@/contexts/LanguageContext";
import { api } from "@/lib/api";

/**
 * Organization picker shown to Super Admins on org-scoped pages.
 * Calls onChange(orgId | orgId[]) when a selection is made.
 * 
 * Props:
 *   filterType  — "BHOJANSHALA" | "DHARAMSHALA" | "PATHSHALA" | undefined (all)
 *   multiple    — if true, allows multi-select (returns array)
 *   excludeIds  — array of org IDs already linked elsewhere (excluded from options)
 *   required    — if true shows a required note
 */
export function OrgSelect({
  value,
  onChange,
  label = "Organization",
  className = "",
  testId = "org-select",
  options,
  filterType,
  multiple = false,
  excludeIds = [],
  required = false,
}) {
  const { t } = useLanguage();
  const { orgs: allOrgs, loading: allLoading } = useOrgs();

  // For type-specific fetching, we use a separate state
  const [filteredOrgs, setFilteredOrgs] = useState(null);
  const [filteredLoading, setFilteredLoading] = useState(false);

  useEffect(() => {
    if (!filterType) {
      setFilteredOrgs(null);
      return;
    }
    const endpointMap = {
      BHOJANSHALA: "/bhojanshala",
      DHARAMSHALA: "/dharamshalas",
      PATHSHALA: "/pathshalas",
    };
    const endpoint = endpointMap[filterType];
    if (!endpoint) { setFilteredOrgs(null); return; }

    setFilteredLoading(true);
    api.get(endpoint)
      .then((res) => {
        const list = res.data?.data?.items || res.data?.data || [];
        setFilteredOrgs(list);
      })
      .catch(() => setFilteredOrgs([]))
      .finally(() => setFilteredLoading(false));
  }, [filterType]);

  const sourceOrgs = options ?? (filterType ? (filteredOrgs || []) : allOrgs);
  const loading = filterType ? filteredLoading : allLoading;

  // Exclude already-linked orgs (one-to-one exclusivity)
  const availableOrgs = excludeIds.length > 0
    ? sourceOrgs.filter((o) => {
        // If this org is already selected (in value array), keep it visible
        if (multiple && Array.isArray(value) && value.includes(o.id)) return true;
        if (!multiple && value === o.id) return true;
        return !excludeIds.includes(o.id);
      })
    : sourceOrgs;

  const selectOptions = availableOrgs.map((o) => ({
    value: o.id,
    label: `${o.name}${o.city ? ` · ${o.city}` : ""} (${o.publicId || o.id.slice(-6)})`,
  }));

  return (
    <div className={className}>
      {label && (
        <Label className="text-xs">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      <SearchableSelect
        value={multiple ? (Array.isArray(value) ? value : []) : (value || "")}
        onValueChange={onChange}
        options={selectOptions}
        placeholder={loading ? t("Loading…") : t("Select organization")}
        searchPlaceholder={t("Search organization…")}
        className="mt-1 max-w-md"
        data-testid={testId}
        multiple={multiple}
      />
      {required && multiple && (!Array.isArray(value) || value.length === 0) && (
        <p className="text-[10px] text-amber-600 mt-1 font-medium">
          {t("Please select at least one organization.")}
        </p>
      )}
      {multiple && Array.isArray(value) && value.length > 0 && (
        <p className="text-[10px] text-slate-500 mt-1">
          {value.length} {t("selected")}
        </p>
      )}
    </div>
  );
}
