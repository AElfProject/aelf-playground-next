"use client";

import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA

import { Button } from "./ui/button";
import { useCliCommands } from "./workspace/use-cli-commands";
import useSWR, { mutate } from "swr";
import { db } from "@/data/db";
import { useWorkspaceId } from "./workspace/use-workspace-id";
import {
  Download,
  Rocket,
  ShieldCheck,
  Wrench,
  TestTube2,
  Link2,
  HandCoins,
  Loader2,
} from "lucide-react";
import UploadModal from "./workspace/upload-modal";
import { Tooltip } from "./tooltip";
import { AuditType } from "@/data/audit";
import {
  Dialog,
  DialogContent,
  DialogPortal
} from "@/components/ui/dialog";
import { useWallet } from "@/data/wallet";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { env } from "@/data/env";

export function BuildDeployPanel() {
  const commands = useCliCommands();
  const [isAuditing, setIsAuditing] = useState(false);
  const [isSaveGasFeeAuditing, setIsSaveGasFeeAuditing] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [captchaType, setCaptchaType] = useState<"" | "audit" | "deploy">("");
  const [isRecaptchaCheck, setIsRecaptchaCheck] = useState(false);
  const [checkingBalanceType, setCheckingBalanceType] = useState<
    "" | "audit" | "deploy"
  >("");
  const id = useWorkspaceId();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const wallet = useWallet();
  const faucetUrl = env.FAUCET_API_URL;
  const captchaSitekey = env.GOOGLE_CAPTCHA_SITEKEY;

  const { data: isDeployable } = useSWR(
    id ? `deployable-${id}` : undefined,
    async () => {
      const ws = await db.workspaces.get(id!);
      return typeof ws?.dll === "string";
    }
  );

  const isBalanceAvailable = async (type: "audit" | "deploy") => {
    try {
      setCheckingBalanceType(type);
      const tokenContract = await wallet?.getTokenContract();
      const balance = await tokenContract.GetBalance.call({
        symbol: "ELF",
        owner: wallet?.wallet.address,
      });
      if (balance.balance === 0) {
        console.log("Don't have balance");
        return false;
      } else {
        setCheckingBalanceType("");
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const showGoogleCaptcha = (type: "audit" | "deploy") => {
    setCaptchaType(type);
    setIsRecaptchaCheck(true);
  };

  const handleAudit = async () => {
    const balance = await isBalanceAvailable("audit");
    if (!balance) {
      showGoogleCaptcha("audit");
    } else {
      try {
        setIsAuditing(true);
        await commands.audit(AuditType.DEFAULT);
      } catch (error) {
      } finally {
        setIsAuditing(false);
      }
    }
  };

  const handleDeploye = async () => {
    const balance = await isBalanceAvailable("deploy");
    if (!balance) {
      showGoogleCaptcha("deploy");
    } else {
      try {
        setIsDeploying(true);
        await commands.deploy();
      } catch (error) {
      } finally {
        setIsDeploying(false);
      }
    }
  };

  const getTokenBalance = async (captchaToken:string) => {
    try {
      const result = await (
        await fetch(
          `${faucetUrl}/api/claim?walletAddress=${wallet?.wallet.address}&recaptchaToken=${captchaToken}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Platform: "Playground", // Add the custom header here
            },
          }
        )
      ).json();
      return result.isSuccess;
    } catch (err) {
      return false;
    }
  };

  const buttons: Array<{
    disabled: boolean;
    title: string;
    onClick: () => void;
    icon: React.FunctionComponent<{ className?: string }>;
    isLoading?: boolean;
  }> = [
    {
      disabled: isAuditing,
      title: "AI Audit",
      onClick: handleAudit,
      icon: ShieldCheck,
      isLoading: checkingBalanceType === "audit",
    },
    {
      disabled: isSaveGasFeeAuditing,
      title: "Save Gas Fee",
      onClick: async () => {
        setIsSaveGasFeeAuditing(true);
        try {
          await commands.audit(AuditType.SAVE_GAS_FEE);
        } catch (err) {
          console.log(err);
        } finally {
          setIsSaveGasFeeAuditing(false);
        }
      },
      icon: HandCoins,
    },
    {
      disabled: isBuilding,
      title: "Build",
      onClick: async () => {
        try {
          setIsBuilding(true);
          await commands.build();
          mutate(`deployable-${id}`);
        } catch (err) {
        } finally {
          setIsBuilding(false);
        }
      },
      icon: Wrench,
    },
    {
      disabled: isTesting,
      title: "Test",
      onClick: async () => {
        try {
          setIsTesting(true);
          await commands.test();
        } catch (err) {
        } finally {
          setIsTesting(false);
        }
      },
      icon: TestTube2,
    },
    {
      disabled: isBuilding || !isDeployable || isDeploying,
      title: "Deploy",
      onClick: handleDeploye,
      icon: Rocket,
      isLoading: checkingBalanceType === "deploy",
    },
    {
      disabled: false,
      title: "Export",
      onClick: async () => {
        try {
          await commands.export();
        } catch (err) {}
      },
      icon: Download,
    },
    {
      disabled: false,
      title: "Share",
      onClick: async () => {
        try {
          await commands.share();
        } catch (err) {}
      },
      icon: Link2,
    },
  ];

  const checkBalanceRecursive = async (type: "audit" | "deploy" | "") => {
    if (type === "") return false;
    let hasBalance = await isBalanceAvailable(type);
    if (!hasBalance) {
      // wait 1s before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await checkBalanceRecursive(type);
    }
    return true;
  }

  const handleCaptchaSuccess = async (captchaToken:string) => {
    try {
      if (captchaType === "deploy") {
        setIsDeploying(true);
        const res = await getTokenBalance(captchaToken);
        await checkBalanceRecursive(checkingBalanceType);
        setCheckingBalanceType("");
        res && (await commands.deploy());
      } else if (captchaType === "audit") {
        setIsAuditing(true);
        const res = await getTokenBalance(captchaToken);
        await checkBalanceRecursive(checkingBalanceType);
        setCheckingBalanceType("");
        res && (await commands.audit(AuditType.DEFAULT));
      }
    } catch (err) {
    } finally {
      setIsDeploying(false);
      setIsAuditing(false);
      closeRecaptcha();
    }
  };

  const onReCAPTCHAChange = (token: string | null) => {
    if (token) {
      setIsRecaptchaCheck(false);
      handleCaptchaSuccess(token);
    }
  };

  const closeRecaptcha = () =>{
    setIsRecaptchaCheck(false);
    setCheckingBalanceType("");
  }

  return (
    <div className="p-4 border-b-2 flex gap-2">
      {buttons.map((button) => (
        <Tooltip text={button.title} key={button.title}>
          <Button
            disabled={button.disabled}
            variant="ghost"
            className="rounded-none p-2"
            onClick={button.onClick}
          >
            {button?.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <button.icon className="w-4 h-4" />
            )}
          </Button>
        </Tooltip>
      ))}
      
      <Dialog
        open={isRecaptchaCheck}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <div className="flex items-center justify-center min-h-[90px]">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={captchaSitekey as string}
                onChange={onReCAPTCHAChange}
              />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <UploadModal />
    </div>
  );
}
