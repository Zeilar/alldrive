import { Box } from "@chakra-ui/react";
import { FileView } from "../../components";
import { API_GLOBAL_PREFIX } from "@alldrive/config";
import { z } from "zod";
import { notFound } from "next/navigation";

interface Props {
  params: {
    externalId: string;
  };
  searchParams?: {
    password?: string;
  };
}

const queryBasePath = `${process.env.API_HOST}/${API_GLOBAL_PREFIX}/files`;

export default async function Page({ params, searchParams }: Props) {
  const { externalId } = params;
  const response = await fetch(`${queryBasePath}/${externalId}/is_protected`);
  if (response.status === 404) {
    notFound();
  }
  const { isFilePasswordProtected } = z
    .object({ isFilePasswordProtected: z.boolean() })
    .parse(await response.json());

  if (!isFilePasswordProtected) {
    return "new component here with only download button";
  }

  let isLocked = true;
  if (searchParams?.password) {
    const response = await fetch(
      `${queryBasePath}/${externalId}/unlock?password=${searchParams?.password}`
    );
    isLocked = !response.ok;
  }

  return (
    <Box m="auto">
      <FileView
        apiHost={process.env.API_HOST}
        externalId={params.externalId}
        initialIsLocked={isLocked}
      />
    </Box>
  );
}
