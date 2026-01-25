import { Card, CardContent } from "@/components/common-elements/card";
import { tailwindCn } from "@/helpers";
import { LucideIcon } from "lucide-react";
import Image from "next/image";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  active?: boolean;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  active,
}: StatsCardProps) {
  return (
    <Card
      className={tailwindCn(
        "rounded-xl shadow-none relative p-0 overflow-hidden",
        active
          ? "bg-primary-800 dark:bg-primary-600 text-white"
          : " border border-[#E4E4E7]"
      )}
    >
      <CardContent className="p-3.5 flex flex-col justify-between h-full">
        <div
          className={tailwindCn(
            "text-sm font-medium max-w-[158px]",
            active ? "text-white/90" : "text-body"
          )}
        >
          {title.toUpperCase()}
        </div>

        <div className="mt-3 flex items-center justify-between py-0.5">
          <p
            className={tailwindCn(
              "text-[21px] font-bold leading-8",
              active ? "text-white" : "text-black dark:text-white"
            )}
          >
            {value}
          </p>
          {!active && (
            <Icon
              className={tailwindCn(
                "h-6 w-6  [&_*]:stroke-[2]",
                active ? "text-white" : "text-primary-500 dark:text-primary-400"
              )}
            />
          )}
        </div>
      </CardContent>
      {active && (
        <Image
          src="/images/stats-card-bg.png"
          alt="logo-image"
          className="absolute w-[501px] h-[183px] mix-blend-color-burn left-[calc(50%-250.5px+42.88px)] 
            top-[calc(50%-91.5px)] min-[500px]:[@media(max-width:640px)]:scale-150 
            [@media(max-width:640px)]:max-w-[701px] max-w-[501px] lg:left-[calc(50%-150.5px)] lg:max-w-[380px]"
          width={501}
          height={183}
          priority
          quality={100}
        />
      )}
    </Card>
  );
}
