"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { db } from "@/data/db";
import { Loader2 } from "lucide-react";
import { playgroundService } from "@/data/playground-service";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .regex(/^[a-zA-Z_]+$/, {
      message:
        "Oops! Please use only letters and underscores. Numbers and special characters like @, #, or 1 are not allowed.",
    }),
  template: z.string(),
});

function getLabel(value: string) {
  switch (value) {
    case "aelf-hello-world":
      return "Hello World";

    case "aelf-lottery":
      return "Lottery";

    case "aelf-nft-sale":
      return "NFT";

    case "aelf-simple-dao":
      return "Simple DAO";

    case "aelf-todo":
      return "Todo";

    case "aelf-tictactoe":
      return "Tic Tac Toe";

    case "aelf-expense":
      return "Expense Tracker";

    case "aelf-staking":
      return "Single Pool Staking";

    default:
      return value;
  }
}

export function WorkspaceForm() {
  const [searchParams] = useSearchParams();
  const templateOptions = [
    "aelf-hello-world",
    "aelf-lottery",
    "aelf-nft-sale",
    "aelf-simple-dao",
    "aelf-todo",
    "aelf-tictactoe",
    "aelf-expense",
    "aelf-staking",
  ];
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      template: searchParams.get("template") || "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    form.clearErrors();
    try {
      await db.workspaces.add({
        name: data.name,
        template: data.template,
        dll: "",
      });
      const templateData = await playgroundService.getTemplateData(data.template, data.name);

      await db.files.bulkAdd(
        templateData.map(({ path, contents }) => ({
          path: `/workspace/${data.name}/${path}`,
          contents,
        }))
      );
      await navigate(`/workspace/${data.name}`);
    } catch (err) {
      form.setError("name", { message: String(err) });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="w-full"
                  placeholder="workspace-name"
                  {...field}
                />
              </FormControl>
              <FormDescription>This is your workspace name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Template</SelectLabel>
                      {templateOptions.map((i) => (
                        <SelectItem key={i} value={i}>
                          {getLabel(i)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>Choose a template</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
