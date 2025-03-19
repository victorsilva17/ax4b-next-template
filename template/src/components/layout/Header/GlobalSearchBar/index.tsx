import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { RiSearch2Line } from "react-icons/ri";

export function GlobalSearchBar() {
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleFocusSearch = () => {
    searchInputRef.current?.focus();
  };

  // Add event listener for Ctrl+K when the component mounts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault(); // Prevent the default browser behavior
        handleFocusSearch();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form
      className="flex flex-row items-center justify-center relative gap-4 max-w-[400px] w-full min-w-[300px]"
      onSubmit={(event) => {
        event.preventDefault();
        window.alert("Buscando globalmente");
      }}
    >
      <Button
        variant={"icon"}
        type="submit"
        className="p-2 absolute top-[50%] left-2 rounded-none translate-y-[-50%]"
      >
        <RiSearch2Line size={20} color="white" />
      </Button>
      <Input
        ref={searchInputRef}
        value={searchText}
        onChange={(event) => {
          setSearchText(event.target.value);
        }}
        className="w-full bg-slate-700 border-none focus:border-none text-white pl-12"
        type="text"
        name="global-search-bar-input"
        id="global-search-bar-input"
        placeholder="Buscar"
      />
    </form>
  );
}
