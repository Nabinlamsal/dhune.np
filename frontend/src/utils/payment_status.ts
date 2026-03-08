
export function mapPaymentStatusToBadge(status: string) {
    switch (status) {
        case "PAID":
            return "success";

        case "UNPAID":
            return "warning";

        case "REFUNDED":
            return "neutral";

        default:
            return "neutral";
    }
}