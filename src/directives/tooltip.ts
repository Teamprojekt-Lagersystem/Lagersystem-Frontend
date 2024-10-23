import { arrow, computePosition, flip, Middleware, offset, shift } from "@floating-ui/dom";
import { useEventListener } from "@vueuse/core";
import type { App } from "vue";

interface TooltipOptions {
  tooltipId: string;
  tooltipContentId: string;
  tooltipArrowId?: string;
  offset?: number;
  shiftPadding?: number;
  arrowPadding?: number;
}

export default (app: App<Element>, options: TooltipOptions) => {
  const tooltip = document.querySelector(`#${options.tooltipId}`) as HTMLDivElement;
  const tooltipContent = document.querySelector(`#${options.tooltipContentId}`) as HTMLDivElement;
  const arrowElement = document.querySelector(`#${options.tooltipArrowId}`) as HTMLDivElement | null;

  let tooltipVisible = false;

  const updateContent = (el: any, value: any) => {
    // thanks to https://github.com/maciejziemichod/v-tooltip/blob/main/tooltip.js#L5
    el.setAttribute("data-v-tooltip", value);
  };

  const showTooltip = (el: any, placement: any, event: MouseEvent) => {
    // don't show tooltip on sm screens
    if (event.view?.innerWidth && event.view.innerWidth < 640) return;

    tooltipContent.innerHTML = el.getAttribute("data-v-tooltip");

    const middleware: Middleware[] = [
      offset(options.offset ?? 0),
      shift({ padding: options.shiftPadding ?? 0 }),
      flip(),
    ];
    if (arrowElement !== null) {
      middleware.push(arrow({ element: arrowElement, padding: options.arrowPadding ?? 0 }));
    }

    computePosition(el, tooltip, {
      placement,
      middleware,
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltip.style, {
        transform: `translate(${x}px, ${y}px)`,
        opacity: "1",
      });

      tooltipVisible = true;

      if (arrowElement !== null) {
        const arrowData = middlewareData.arrow;

        const staticSide = {
          top: "bottom",
          right: "left",
          bottom: "top",
          left: "right",
        }[placement.split("-")[0]]!;

        Object.assign(arrowElement!.style, {
          left: arrowData?.x != null ? `${arrowData.x}px` : "",
          top: arrowData?.y != null ? `${arrowData.y}px` : "",
          right: "",
          bottom: "",
          [staticSide]: "-4px",
        });
      }
    });
  };

  const hideTooltip = () => {
    if (tooltipVisible) {
      Object.assign(tooltip.style, {
        opacity: "0",
      });
    }

    tooltipVisible = false;
  };

  addEventListener("resize", () => {
    tooltipContent.innerText = "";
    Object.assign(tooltip.style, {
      transform: "translate(0px, 0px)",
    });
  });

  app.directive("tooltip", {
    mounted(el, binding) {
      if (!binding.arg) binding.arg = "top";

      useEventListener(el, "mouseenter", ev => showTooltip(el, binding.arg!, ev));
      useEventListener(el, "mouseleave", hideTooltip);

      updateContent(el, binding.value);
    },
    updated(el, binding) {
      updateContent(el, binding.value);
    },
    unmounted() {
      hideTooltip();
    },
  });
};
