// helpers/errorHandler.ts
export function handleError(e: any, toast: any) {
  if (e.code === "ECONNABORTED") {
    toast({
      title: "Request Timeout",
      description: "The server took too long to respond. Please try again.",
      variant: "destructive",
    });
  } else if (e.response) {
    const { status, data } = e.response;
    toast({
      title: "Error",
      description: data?.error || `Unexpected error: ${status}`,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Network Error",
      description: "Please check your connection.",
      variant: "destructive",
    });
  }
}
