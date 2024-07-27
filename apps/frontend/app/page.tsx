import { Box } from "@chakra-ui/react";
import { Dropzone } from "../components";

export default function Page() {
  return (
    <Box m="auto">
      <Dropzone apiHost={process.env.API_HOST} />
    </Box>
  );
}
