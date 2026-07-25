"use client";

import { CheckCircle2 } from "lucide-react";

// TODO(lottie): swap this placeholder for the real animation once the JSON
// export is ready. `npm install lottie-react`, drop the exported file at
// e.g. public/animations/survey-success.json, then replace the body below
// with:
//
//   import Lottie from "lottie-react";
//   import surveySuccess from "@/public/animations/survey-success.json";
//
//   export function SuccessAnimation() {
//     return (
//       <Lottie
//         animationData={surveySuccess}
//         loop={false}
//         style={{ height: 120 }}
//       />
//     );
//   }
// export function SuccessAnimation() {
//   return (
//     <div className="flex h-[120px] items-center justify-center">
//       <CheckCircle2 className="size-16 animate-in zoom-in-50 fade-in-0 text-[#1D9E75] duration-700" />
//     </div>
//   );
// }

  import Lottie from "lottie-react";
  import surveySuccess from "@/public/animations/survey-success.json";

  export function SuccessAnimation() {
    return (
      <Lottie
        animationData={surveySuccess}
        loop={true}
        style={{ height: 120 }}
      />
    );
  }
