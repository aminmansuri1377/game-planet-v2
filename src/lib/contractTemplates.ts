interface ContractParagraph {
  title: string;
  content: string;
}

export const contractTemplates = {
  base: (
    order: any,
    buyer: any,
    seller: any,
    product: any
  ): ContractParagraph[] => [
    {
      title: "مقدمه قرارداد",
      content: `این قرارداد بین خریدار با نام ${buyer.firstName} ${buyer.lastName} و شماره تماس ${buyer.phone} و فروشنده با نام ${seller.firstName} ${seller.lastName} و شماره تماس ${seller.phone} برای محصول ${product.name} با قیمت ${order.totalPrice} تومان منعقد می‌گردد.`,
    },
    {
      title: "شرایط تحویل",
      content: `تحویل محصول با روش ${
        order.sendingType === "SELLER_SENDS"
          ? "ارسال توسط فروشنده"
          : "دریافت توسط خریدار"
      } انجام خواهد شد.`,
    },
    {
      title: "تاییدیه فروشنده",
      content: `فروشنده تایید می‌کند که محصول ${
        product.name
      } را در تاریخ ${new Date(order.startDate).toLocaleDateString(
        "fa-IR"
      )} آماده تحویل خواهد کرد.`,
    },
    {
      title: "تاییدیه خریدار",
      content: `خریدار تایید می‌کند که محصول ${
        product.name
      } را در تاریخ ${new Date(order.endDate).toLocaleDateString(
        "fa-IR"
      )} تحویل گرفته است.`,
    },
    {
      title: "پایان قرارداد",
      content: `این قرارداد در تاریخ ${new Date().toLocaleDateString(
        "fa-IR"
      )} به اتمام رسیده و کلیه تعهدات طرفین انجام شده است.`,
    },
  ],
};
