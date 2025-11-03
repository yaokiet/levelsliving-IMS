"use client";

type ConnectionStatusProps = {
  isConnected: boolean;
};

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div className="flex items-center space-x-2">
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isConnected ? "bg-green-500" : "bg-red-500 animate-pulse"
        }`}
      ></span>
      <span className="text-sm text-muted-foreground">
        {isConnected ? "Connected" : "Connecting..."}
      </span>
    </div>
  );
}