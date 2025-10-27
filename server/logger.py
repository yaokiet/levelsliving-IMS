import logging
import sys
import functools
import inspect


logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
stream_handler = logging.StreamHandler(sys.stdout)
log_formatter = logging.Formatter(
    "%(asctime)s [%(processName)s: %(process)d] [%(threadName)s: %(thread)d] [%(levelname)s] %(name)s: %(message)s")
stream_handler.setFormatter(log_formatter)
logger.addHandler(stream_handler)


def log_execution(func):
    @functools.wraps(func)
    async def async_wrapper(*args, **kwargs):
        instance = args[0] if args else None
        class_name = type(instance).__name__ if instance else func.__qualname__.split('.')[0]
        method_name = func.__name__

        logger.info(f"[{class_name}.{method_name}] Called with args: {args[1:]}, kwargs: {kwargs}")
        result = await func(*args, **kwargs)
        logger.info(f"[{class_name}.{method_name}] Returned: {repr(result)[:100]}")
        return result

    @functools.wraps(func)
    def sync_wrapper(*args, **kwargs):
        instance = args[0] if args else None
        class_name = type(instance).__name__ if instance else func.__qualname__.split('.')[0]
        method_name = func.__name__

        logger.info(f"[{class_name}.{method_name}] Called with args: {args[1:]}, kwargs: {kwargs}")
        result = func(*args, **kwargs)
        logger.info(f"[{class_name}.{method_name}] Returned: {repr(result)[:100]}")
        return result

    if inspect.iscoroutinefunction(func):
        return async_wrapper
    else:
        return sync_wrapper

