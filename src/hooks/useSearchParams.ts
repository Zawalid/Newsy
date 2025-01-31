import { useSearchParams as useSP, usePathname, useRouter } from "next/navigation";

export const useSearchParams = () => {
  const searchParams = useSP();
  const pathname = usePathname();
  const { replace } = useRouter();

  const setSearchParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });

    replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return { searchParams, setSearchParams };
};
