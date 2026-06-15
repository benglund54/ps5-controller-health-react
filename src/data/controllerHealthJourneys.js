export const controllerHealthJourneys = {
  // ── Sarah: in-warranty · included free replacement ────────────────────────
  PLAYER001: {
    recommendationType: "INCLUDED_REPLACEMENT",
    toast: {
      title: "Controller health check",
      message: "Your right stick may not be centering correctly."
    },
    overlay: {
      title: "Controller health check",
      subtitle: "Choose your replacement option.",
      statusChip: "SELF-SERVICE",
      steps: [
        {
          id: "issue_and_options",
          title: "Controller health check",
          subtitle: "Choose your replacement option.",
          label: "Issue detected",
          body: "Signs of right stick drift were detected.",
          helper: "This can affect aim and movement.",
          badge: "Detected issue",
          variant: "issue_and_options"
        },
        {
          id: "confirm_delivery",
          title: "Confirm delivery",
          subtitle: "Review your controller selection and delivery details.",
          label: "Confirm delivery",
          body: "",
          helper: "",
          variant: "confirm_delivery"
        },
        {
          id: "done",
          title: "Replacement confirmed",
          subtitle: "Your controller details are ready.",
          label: "Confirmation",
          body: "",
          helper: "",
          variant: "done"
        }
      ]
    }
  },

  // ── Marcus: out-of-warranty · personalized upgrade options ────────────────
  PLAYER002: {
    recommendationType: "PERSONALIZED_UPGRADE",
    toast: {
      title: "Controller health check",
      message: "Your controller may be showing signs of stick drift."
    },
    overlay: {
      title: "Controller health check",
      subtitle: "Upgrade options are available based on your PlayStation activity.",
      statusChip: "PERSONALIZED",
      steps: [
        {
          id: "review_issue",
          title: "Controller health check",
          subtitle: "Upgrade options are available based on your PlayStation activity.",
          label: "Detected issue",
          body: "Stick drift patterns were detected.",
          helper: "Based on your controller status and PlayStation activity, these options are recommended for you.",
          badge: "Detected issue",
          variant: "issue"
        },
        {
          id: "compare_options",
          title: "Choose your option",
          subtitle: "Based on your controller status and PlayStation activity.",
          label: "Choose your option",
          body: "Select the controller that best fits your play style.",
          variant: "compare",
          options: [
            {
              id: "edge",
              title: "DualSense Edge Wireless Controller",
              description: "Premium controls · Replaceable stick modules",
              chip: "Recommended"
            },
            {
              id: "dualsense",
              title: "DualSense Wireless Controller",
              description: "Discounted replacement option",
              chip: "Discount option"
            },
            {
              id: "limited",
              title: "Limited Edition Controller",
              description: "Personalized style option · Availability varies",
              chip: "Limited edition"
            }
          ]
        },
        {
          id: "confirm_path",
          title: "Checkout",
          subtitle: "Review your controller selection.",
          label: "Checkout",
          body: "Review your selection before confirming.",
          helper: "",
          variant: "demoCheckout"
        },
        {
          id: "confirmation",
          title: "Checkout confirmed",
          subtitle: "Your selection has been confirmed.",
          label: "Checkout confirmed",
          body: "Checkout confirmed.",
          helper: "",
          variant: "confirmation"
        }
      ]
    }
  },

  // ── Nina: firmware troubleshooting · no replacement offer ─────────────────
  PLAYER003: {
    recommendationType: "FIRMWARE_TROUBLESHOOTING",
    toast: {
      title: "Controller health check",
      message: "Your controller has disconnected more than expected."
    },
    overlay: {
      title: "Controller health check",
      subtitle: "Let's try a firmware update first.",
      statusChip: "TROUBLESHOOTING",
      steps: [
        {
          id: "review_issue",
          title: "Controller health check",
          subtitle: "Let's try a firmware update first.",
          label: "Connection issue detected",
          body: "Recent sessions show disconnect frequency above expected levels.",
          helper: "A firmware update is the recommended first step.",
          badge: "Connection issue",
          variant: "issue"
        },
        {
          id: "firmware_guidance",
          title: "Firmware update recommended",
          subtitle: "Keep your controller connected during this process.",
          label: "Firmware update",
          body: "A firmware update is available for your controller.",
          helper: "This update may resolve the disconnect issues. Start the update simulation to continue.",
          badge: "Update available",
          variant: "firmware"
        },
        {
          id: "update_progress",
          title: "Updating controller",
          subtitle: "Keep your controller connected.",
          label: "Simulated update",
          body: "Preparing → Updating → Verifying connection",
          helper: "Please keep the controller connected during this step.",
          variant: "update_progress"
        },
        {
          id: "monitoring_summary",
          title: "Update complete",
          subtitle: "Your controller firmware is now up to date.",
          label: "Update complete",
          body: "Your controller is now up to date. We'll continue monitoring for connection issues.",
          helper: "No replacement is recommended at this time.",
          variant: "confirmation"
        }
      ]
    }
  },

  // ── Alex (PLAYER004): DualSense Edge · stick module path ─────────────────
  PLAYER004: {
    recommendationType: "STICK_MODULE_PATH",
    toast: {
      title: "Controller health check",
      message: "Your right stick module may need attention."
    },
    overlay: {
      title: "Controller health check",
      subtitle: "Your right stick module may need attention.",
      statusChip: "MODULE PATH",
      steps: [
        {
          id: "review_issue",
          title: "Controller health check",
          subtitle: "Your right stick module may need attention.",
          label: "Detected issue",
          body: "Right stick module health requires attention.",
          helper: "Controller: DualSense Edge · Serial: ZCT2E-2M3N4O5P",
          badge: "Module issue",
          variant: "issue"
        },
        {
          id: "module_option",
          title: "Stick module option",
          subtitle: "A replacement stick module is available for your DualSense Edge.",
          label: "Module option",
          body: "Recommended: DualSense Edge stick module replacement.",
          helper: "This is the targeted resolution for your controller model.",
          badge: "Recommended",
          variant: "option"
        },
        {
          id: "confirm_model",
          title: "Confirm controller model",
          subtitle: "Confirm your DualSense Edge details.",
          label: "Confirm model",
          body: "Controller: DualSense Edge · Serial ZCT2E-2M3N4O5P",
          helper: "Confirm to proceed with the module path.",
          variant: "confirm"
        },
        {
          id: "confirmation",
          title: "Stick module path confirmed",
          subtitle: "Your stick module path has been confirmed.",
          label: "Confirmed",
          body: "Stick module path confirmed.",
          helper: "",
          variant: "confirmation"
        }
      ]
    }
  }
};

export function getControllerHealthJourney(ownerId) {
  return controllerHealthJourneys[ownerId] ?? controllerHealthJourneys.PLAYER003;
}
