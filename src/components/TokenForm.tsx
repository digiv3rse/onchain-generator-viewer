import { useIdle } from "../hooks/useIdle";
import { cn } from "../lib/utils";
import { networkCoreDeployments } from "../utils/env";
import {
  ArrowUpRight,
  Check,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDown,
  EditIcon,
  PanelBottomOpen,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcwIcon,
} from "lucide-react";
import { useEffect, useId, useState } from "react";
import { DiGiArtLockup } from "./DiGiArtLockup";
import { GitHubIcon } from "./GitHubIcon";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Input } from "./ui/input";
import { useTokenFormStore } from "../stores/tokenFormStore";
import { usePublicClientStore } from "../stores/publicClientStore";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Tooltip } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { EthereumIcon } from "./EthereumIcon";

export function TokenForm() {
  // Get and initialize the token form state
  const {
    contractAddress,
    projectId,
    tokenInvocation,
    projectRange,
    invocations,
    isLoading,
    setContractAddress,
    setProjectId,
    setTokenInvocation,
    initialize,
  } = useTokenFormStore();
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerDirection, setDrawerDirection] = useState<"left" | "bottom">(
    "left"
  );
  // Drawer direction changes based on screen size, left for desktop, bottom for mobile
  useEffect(() => {
    const handleResize = () => {
      setDrawerDirection(window.innerWidth >= 640 ? "left" : "bottom");
    };

    // Set initial direction
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide the drawer trigger when the user is idle
  const isIdle = useIdle();

  return (
    <>
      <Drawer
        direction={drawerDirection}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      >
        <DrawerTrigger
          asChild
          autoFocus={false}
          className={cn(
            "absolute z-20 bottom-4 left-4 sm:bottom-auto sm:top-10 sm:left-10 p-4 bg-black bg-opacity-50 rounded-full transition-all duration-500 hover:bg-opacity-80",
            {
              "opacity-0": isIdle,
            }
          )}
        >
          <button>
            <PanelLeftOpen className="hidden w-5 h-5 stroke-1 stroke-white sm:block" />
            <PanelBottomOpen className="w-5 h-5 stroke-1 stroke-white sm:hidden" />
            <VisuallyHidden>Open Token Selection Form</VisuallyHidden>
          </button>
        </DrawerTrigger>
        <DrawerContent
          className="sm:rounded-lg sm:inset-auto sm:mt-auto sm:left-2 sm:top-2 sm:bottom-2 sm:max-w-[400px]"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="flex flex-col w-full mx-auto overflow-auto sm:h-full bg-background">
            <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted sm:hidden" />
            <DrawerHeader>
              <div className="flex justify-between">
                <DrawerTitle className="flex justify-center flex-1 sm:justify-start">
                  <DiGiArtLockup
                    height={24}
                    className="fill-black w-[132px]"
                  />
                </DrawerTitle>
                <DrawerClose asChild className="hidden sm:block">
                  <button className="transition-opacity duration-300 opacity-50 hover:opacity-100">
                    <PanelLeftClose className="w-6 h-6 stroke-1 stroke-muted-foreground" />
                    <VisuallyHidden>Close Token Selection Form</VisuallyHidden>
                  </button>
                </DrawerClose>
              </div>
              <DrawerDescription>
                Choose a token to view it using data stored entirely on-chain.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col flex-1 gap-4 px-4 mb-6">
              <div>
                <label className="block w-full mb-2">Contract</label>
                <ContractSelect
                  value={contractAddress}
                  handleChange={setContractAddress}
                />
              </div>
              <BoundNumericInput
                label="Project"
                value={projectId?.toString() ?? ""}
                onValueChange={(value) => {
                  if (isNaN(Number(value))) {
                    return;
                  }
                  setProjectId(Number(value));
                }}
                onBlur={(value) => {
                  if (isNaN(Number(value)) || !projectRange) {
                    return;
                  }

                  const clampedId = Math.max(
                    Math.min(Number(value), projectRange[1]),
                    projectRange[0]
                  );

                  setProjectId(clampedId);
                }}
                min={projectRange?.[0]}
                max={projectRange?.[1]}
                loading={isLoading.projectRange}
              />
              <BoundNumericInput
                label="Token"
                value={tokenInvocation?.toString() ?? ""}
                notice={<OnChainDetails className="ml-1" />}
                onValueChange={(value) => {
                  if (isNaN(Number(value))) {
                    return;
                  }

                  setTokenInvocation(Number(value));
                }}
                onBlur={(value) => {
                  if (!invocations || isNaN(Number(value))) {
                    return;
                  }

                  const clampedValue = Math.max(
                    Math.min(Number(value), invocations - 1),
                    0
                  );

                  setTokenInvocation(clampedValue);
                }}
                min={0}
                max={invocations ? invocations - 1 : 0}
                loading={isLoading.invocations}
              />
            </div>
            <JsonRpcUrlForm className="px-4" />
            <DrawerFooter>
              <div className="flex items-center justify-between gap-2">
                <a
                  href="https://github.com/ArtBlocks/on-chain-generator-viewer"
                  target="_blank"
                  className="opacity-50 hover:opacity-100"
                >
                  <GitHubIcon fill="black" className="w-6 h-6" />
                </a>
                <a
                  className="flex items-center gap-1 opacity-50 hover:opacity-100"
                  href="https://artblocks.io/onchain"
                  target="_blank"
                >
                  Learn more <ArrowUpRight className="w-4 h-4 stroke-1" />
                </a>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function ContractSelect({
  value,
  handleChange,
  className,
}: {
  value?: string;
  handleChange: (address: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const supportedContracts = useTokenFormStore(
    (state) => state.supportedContractDeployments
  );

  const val = value ?? networkCoreDeployments[0].address;
  const label = supportedContracts.find((d) => d.address === val)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-expanded={open}
          className={cn(
            "flex text-body items-center justify-between w-full px-4 py-2 h-10 rounded-[2px] border border-border",
            className
          )}
        >
          <span className="overflow-hidden text-ellipsis">
            <span className="mr-2">{label ?? val}</span>
            {label ? (
              <span className="text-xs text-muted-foreground">
                ({val.slice(0, 6)}…{val.slice(-4)})
              </span>
            ) : null}
          </span>
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 stroke-1 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] h-[var(--radix-popover-content-available-height)] sm:h-auto p-0">
        <Command>
          <CommandInput placeholder="Search contracts..." />
          <CommandList>
            <CommandEmpty>No contract found.</CommandEmpty>
            <CommandGroup>
              {supportedContracts.map((deployment) => (
                <CommandItem
                  key={deployment.address}
                  value={deployment.address}
                  onSelect={(currentValue) => {
                    handleChange(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === deployment.address ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="overflow-hidden">
                    <span className="block overflow-hidden text-ellipsis">
                      {deployment.label ?? deployment.address}
                    </span>
                    {deployment.label ? (
                      <span className="text-xs text-muted-foreground">
                        ({deployment.address})
                      </span>
                    ) : null}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function OnChainDetails({ className }: { className?: string }) {
  const projectOnChainStatus = useTokenFormStore(
    (state) => state.projectOnChainStatus
  );

  if (!projectOnChainStatus) {
    return null;
  }

  const {
    dependencyFullyOnChain,
    injectsDecentralizedStorageNetworkAssets,
    hasOffChainFlexDepRegDependencies,
  } = projectOnChainStatus;

  const fullyOnChain =
    dependencyFullyOnChain &&
    !injectsDecentralizedStorageNetworkAssets &&
    !hasOffChainFlexDepRegDependencies;

  let message = "";
  if (fullyOnChain) {
    message = "All components of this artwork are stored fully on-chain.";
  } else {
    const issues: string[] = [];

    if (!dependencyFullyOnChain || hasOffChainFlexDepRegDependencies) {
      issues.push("relies on libraries that have not yet been stored on-chain");
    }

    if (injectsDecentralizedStorageNetworkAssets) {
      issues.push(
        "requires assets stored off-chain using decentralized storage"
      );
    }

    message = `This artwork ${issues.join(" and ")}.`;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <EthereumIcon
          className={cn(
            "w-4 h-4",
            {
              "fill-green-500": fullyOnChain,
              "fill-yellow-500": !fullyOnChain,
            },
            className
          )}
        />
      </TooltipTrigger>
      <TooltipContent>{message}</TooltipContent>
    </Tooltip>
  );
}

export function JsonRpcUrlForm({ className }: { className?: string }) {
  const [editing, setEditing] = useState(false);
  const { jsonRpcUrl, setJsonRpcUrl, resetJsonRpcUrl } = usePublicClientStore();
  const [pendingJsonRpcUrl, setPendingJsonRpcUrl] = useState(jsonRpcUrl);
  const isDefaultJsonRpcUrl =
    jsonRpcUrl === import.meta.env.VITE_JSON_RPC_PROVIDER_URL;

  useEffect(() => {
    setPendingJsonRpcUrl(jsonRpcUrl);
  }, [jsonRpcUrl]);

  return (
    <form
      className={className}
      onSubmit={(e) => {
        e.preventDefault();
        if (editing) {
          setJsonRpcUrl(pendingJsonRpcUrl);
        }
        setEditing(!editing);
      }}
    >
      <label className="block mb-2 text-muted-foreground">
        Ethereum RPC Endpoint
      </label>
      <div className="flex items-center gap-4">
        <Input
          value={pendingJsonRpcUrl}
          onChange={(e) => setPendingJsonRpcUrl(e.target.value)}
          disabled={!editing}
        />
        <button type="submit">
          {editing ? (
            <>
              <CheckIcon className="w-4 h-4 stroke-1" />
              <VisuallyHidden>Set RPC Endpoint</VisuallyHidden>
            </>
          ) : (
            <>
              <EditIcon className="w-4 h-4 stroke-1" />
              <VisuallyHidden>Edit RPC Endpoint</VisuallyHidden>
            </>
          )}
        </button>
        {!editing && !isDefaultJsonRpcUrl ? (
          <button
            onClick={() => {
              resetJsonRpcUrl();
            }}
            type="button"
          >
            <RotateCcwIcon className="w-4 h-4 stroke-1" />
            <VisuallyHidden>Reset RPC Endpoint</VisuallyHidden>
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function BoundNumericInput({
  label,
  value,
  notice,
  onValueChange,
  onBlur,
  min,
  max,
  loading,
  className,
}: {
  label: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: (value: string) => void;
  notice?: React.ReactNode;
  min?: number;
  max?: number;
  loading?: boolean;
  className?: string;
}) {
  const id = useId();

  const isDecrementDisabled =
    min === undefined || isNaN(Number(value)) || Number(value) <= min;
  const isIncrementDisabled =
    max === undefined || isNaN(Number(value)) || Number(value) >= max;

  return (
    <div className={className}>
      <label className="flex mb-2" htmlFor={id}>
        <span>
          <span>{label}</span>{" "}
          <span className="text-xs text-muted-foreground">
            (min: {min}, max: {max})
          </span>
        </span>
        {notice}
      </label>
      <div
        className={cn(
          "flex items-center gap-4 opacity-100 transition-opacity duration-300",
          {
            "opacity-80": loading,
          }
        )}
      >
        <button
          className="flex text-left opacity-50"
          onClick={() => onValueChange((Number(value) - 1).toString())}
          disabled={isDecrementDisabled}
        >
          <ChevronLeftIcon
            className={cn("w-4 h-4 stroke-1", {
              "opacity-20": isDecrementDisabled,
            })}
          />
        </button>
        <Input
          id={id}
          className="flex-1 text-center"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={(e) => onBlur?.(e.target.value)}
          min={min}
          max={max}
        />
        <button
          className="flex text-right opacity-50"
          onClick={() => onValueChange((Number(value) + 1).toString())}
          disabled={isIncrementDisabled}
        >
          <ChevronRightIcon
            className={cn("w-4 h-4 stroke-1", {
              "opacity-20": isIncrementDisabled,
            })}
          />
        </button>
      </div>
    </div>
  );
}
