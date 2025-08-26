"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Database, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Server,
  Zap
} from "lucide-react"
import { useDatabaseTest } from "@/hooks/use-database-test"

interface DatabaseTestButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  className?: string
}

export function DatabaseTestButton({ 
  variant = "outline", 
  size = "sm", 
  showLabel = true,
  className = ""
}: DatabaseTestButtonProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { testing, lastResult, error, testConnection, clearResult } = useDatabaseTest()

  const handleTest = async () => {
    await testConnection()
  }

  const getStatusIcon = () => {
    if (testing) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }
    
    if (lastResult) {
      return lastResult.success 
        ? <CheckCircle className="h-4 w-4 text-green-600" />
        : <XCircle className="h-4 w-4 text-red-600" />
    }
    
    return <Database className="h-4 w-4" />
  }

  const getStatusColor = () => {
    if (testing) return "border-blue-300 hover:bg-blue-50"
    if (lastResult) {
      return lastResult.success 
        ? "border-green-300 hover:bg-green-50 text-green-700"
        : "border-red-300 hover:bg-red-50 text-red-700"
    }
    return "border-gray-300 hover:bg-gray-50"
  }

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={handleTest}
      disabled={testing}
      className={`${getStatusColor()} ${className}`}
    >
      {getStatusIcon()}
      {showLabel && size !== "icon" && (
        <span className="ml-2">
          {testing ? "Testing..." : "DB Test"}
        </span>
      )}
    </Button>
  )

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={() => lastResult && setShowDetails(true)}>
              {buttonContent}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">Database Connection Test</p>
              {lastResult && (
                <p className="text-xs text-gray-600 mt-1">
                  {lastResult.success ? "✓ Connected" : "✗ Failed"} 
                  {lastResult.details?.responseTime && ` (${lastResult.details.responseTime}ms)`}
                </p>
              )}
              {!lastResult && !testing && (
                <p className="text-xs text-gray-600 mt-1">Click to test connection</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Connection Test
            </DialogTitle>
            <DialogDescription>
              Connection status and performance details
            </DialogDescription>
          </DialogHeader>
          
          {lastResult && (
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-center">
                <Badge 
                  variant={lastResult.success ? "default" : "destructive"}
                  className="flex items-center gap-2 text-sm py-2 px-4"
                >
                  {lastResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  {lastResult.success ? "Connection Successful" : "Connection Failed"}
                </Badge>
              </div>

              {/* Message */}
              <div className="text-center">
                <p className="text-sm text-gray-700">{lastResult.message}</p>
              </div>

              {/* Details */}
              {lastResult.details && (
                <div className="space-y-3 border-t pt-4">
                  <h4 className="font-medium text-sm">Connection Details:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {lastResult.details.host && (
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Host:</span>
                        <span className="font-mono">{lastResult.details.host}</span>
                      </div>
                    )}
                    {lastResult.details.database && (
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Database:</span>
                        <span className="font-mono">{lastResult.details.database}</span>
                      </div>
                    )}
                    {lastResult.details.responseTime && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-mono">{lastResult.details.responseTime}ms</span>
                        <Badge variant="outline" className="ml-auto">
                          {lastResult.details.responseTime < 100 ? (
                            <>
                              <Zap className="h-3 w-3 mr-1 text-green-600" />
                              Fast
                            </>
                          ) : lastResult.details.responseTime < 500 ? (
                            <>
                              <Clock className="h-3 w-3 mr-1 text-yellow-600" />
                              Normal
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1 text-red-600" />
                              Slow
                            </>
                          )}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Details */}
              {error && !lastResult.success && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-sm text-red-700 mb-2">Error Details:</h4>
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-sm font-mono text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                  disabled={testing}
                  className="flex-1"
                >
                  {testing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Test Again
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearResult()
                    setShowDetails(false)
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
