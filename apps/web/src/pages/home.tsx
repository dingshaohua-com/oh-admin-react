import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/shadcn-compnts/components/tooltip";
import { Badge } from "@repo/shadcn-compnts/components/badge";
import { Button } from "@repo/shadcn-compnts/components/button";

export default function Home() {
  return (
    <div>
      <div className="text-red-400">你好</div>
      <Badge>徽章</Badge>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>呵呵</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
