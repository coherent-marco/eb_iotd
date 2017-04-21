from django import template
from django import forms
from django.contrib.humanize.templatetags import humanize
from django.template import defaultfilters
from django.utils.translation import ugettext_lazy as _, get_language
import colorsys, os, logging
import math

logger = logging.getLogger('debug')

register = template.Library()

@register.filter(is_safe=True)
def asDollar(val):
    return '${:,.0f}'.format(val)

@register.filter(is_safe=True)
def splitRange(string):
    return string.split(';')

@register.filter(is_safe=True)
def replaceUnderscore(string):
    return string.replace('_',' ')

@register.filter(is_safe=True)
def is_numeric(boundfield):
    if isinstance(boundfield.field, forms.IntegerField):
        return True
    elif isinstance(boundfield.field, forms.DecimalField):
        return True
    elif isinstance(boundfield.field, forms.FloatField):
        return True
    else:
        return False

@register.filter(is_safe=True)
def is_text(boundfield):
    return isinstance(boundfield.field, forms.CharField)

@register.filter(is_safe=True)
def is_boolean(boundfield):
    return isinstance(boundfield.field, forms.BooleanField)

# Tags for variables
@register.filter(is_safe=True)
def var_is_numeric(variable):
    try:
        int(variable)
        return True
    except ValueError:
        return False

@register.filter(is_safe=True)
def getID(object, key):
    return object.getID(key)

@register.filter(is_safe=True)
def getName(object, key):
    return object.getName(key)

@register.filter(is_safe=True)
def compare(value,k):
    return (value==k)

@register.filter(is_safe=True)
def inside(value,k):
    return (k in value)

@register.filter(is_safe=True)
def getValue(object,key):
    try:
        val=(object[key])
    except:
        try:
            val=getattr(object, key)
        except:
            val=None
    return val

@register.filter
def getType(value):
   return type(value).__name__

@register.filter
def compareType(object,value):
   return type(object) is type(value)

@register.filter
def Range(n):
   return range(n)

@register.filter(is_safe=True)
def isnan(value):
    return value != value   # Semi-hack to check where a value is nan, which does not equal itself

@register.filter(is_safe=True)
def notexist(value):
    return value!=value or value is None or value==''

# Handle product comparison output 1: String of logicals ('True' or 'False') -> fa-icons check (tick) or times (cross)
@register.filter(is_safe=True)
def pc_logical(value):
    if value in {1, True, 'True', 'TRUE', 'Y'}:
        return '<i class="fa fa-check text-navy"></i>'
    elif value in {0, False, 'False', 'FALSE', 'N'}:
        return '<i class="fa fa-times text-danger"></i>'
# Handle product comparison output 1: String of logicals ('True') -> fa-icons check (tick), All else False -> or times (cross)
@register.filter(is_safe=True)
def pc_logical_none(value):
    if value in {1, True, 'True', 'Y'}:
        return '<i class="fa fa-check text-navy"></i>'
    else:
        return '<i class="fa fa-times text-danger"></i>'


@register.simple_tag
def set_var(val):
    return val

@register.filter(is_safe=True)
def translate(value):
    return _(value)

@register.filter(is_safe=True)
def product_name(value, delimiter='::'):
    splited = value.split(delimiter)
    if (len(splited) > 1):
        content = ''.join(['<li>{0}</li>'.format(extra) for extra in splited[1:]])
        return splited[0] + '<sup><button class="flip-exempt btn btn-tooltip btn-xs" data-toggle="popover" data-placement="bottom" data-trigger="hover" data-content="<ul>{0}</ul>" data-html="true" style="color:inherit;padding:0"><i class="fa fa-commenting-o"></i></button></sup>'.format(content)
        #return '&nbsp'.join([splited[0]] + ['<button class="btn btn-tooltip btn-xs" data-toggle="popover" data-placement="bottom" data-trigger="hover" data-content="{0}"><i class="fa fa-question-circle-o"></i></button>'.format(extra) for extra in splited[1:]])
    else: return value

@register.filter(is_safe=True)
def line_break(value, new_p_dlm='::', new_line_dlm=';;'):
    try:
        if new_p_dlm in value:
            splited = value.split(new_p_dlm)
            content = ''.join(['<p class="long-detail">{0}</p>'.format(extra) for extra in splited]).replace("_","&nbsp;").replace(new_line_dlm,"<br>")
        elif new_line_dlm in value:
            content = value.replace(new_line_dlm, "<br>")
        else:
            return value
        content = '<div style="flex: 1 0; flex-direction: column;">{}</div>'.format(content)
        return content
    except:
        return value

@register.filter(is_safe=True)
def illness_list(value):
    list = "<ol>"
    for illness in value:
        list += "<li>" + illness[0]
        list += "<br><b>[" + illness[1] + "]</b></li>" if illness[1] != None else "</li>"
    list += "</ol>"
    return list

@register.filter(is_safe=True)
def round_up_to_nearest(value, nearest=10):
    try:
        return humanize.intcomma(math.ceil(value / nearest) * nearest)
        #return str(rounded) + '<sup><button class="flip-exempt btn btn-tooltip btn-xs" data-toggle="popover" data-placement="bottom" data-trigger="hover" data-content="{}" style="color:inherit;padding:0"><i class="fa fa-commenting-o"></i></button></sup>'.format(_("Rounded up to nearest %(nearest)s") %{'nearest': nearest})
        # return '<i class="fa fa-usd" aria-hidden="true"></i>' * (sorted([100,500,1000,5000,10000,50000,value]).index(value) + 1)
        # return '$' * (sorted([100,500,1000,5000,10000,50000,value]).index(value) + 1)
        # return _("Not Available")
    except:
        return value

@register.filter(is_safe=True)
def ApplyFX(value, currency = "HKD"):
    try:
        if currency == "RMB":
            return int(value / 1.125)
        elif currency == "USD":
            return int(value / 7.756)
        else:
            return value
    except:
        return value


ALLOWED_ENVIRON = (
    'TRACKING_ID',
    'WEBSITE_HOSTNAME',
)
@register.simple_tag
def environ(key):
    if key in ALLOWED_ENVIRON:
        return os.getenv(key, '')

    logger.warning('Rejected attempt to access environment variable: %s' %key)
    return ''

ALLOWED_SETTINGS = (
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_CONNECTION',
)
@register.simple_tag
def settings(key):
    if key in ALLOWED_SETTINGS:
        from django.conf import settings as _settings
        return getattr(_settings, key, '')

    logger.warning('Rejected attempt to access setting variable: %s' %key)
    return ''

@register.simple_tag
def minify_url(value):
    return value.replace('.', '.min.')

@register.filter('has_group')
def has_group(user, group_name):
    groups = user.groups.all().values_list('name', flat=True)
    return group_name in groups

language_display_names = {
    'en': 'ENG',
    'zh': '繁體',
}
@register.simple_tag
def get_language_display_name(language_code):
    generic_language_code = language_code.split('-')[0]
    return language_display_names[generic_language_code]

@register.simple_tag
def jsi18n(app):
    apps = 'app+{app}'.format(app=app.replace('/','')) if app else 'app'
    return '/jsi18n/{apps}/{lang}/'.format(apps=apps, lang=get_language())

@register.filter
def get(collection, args):
    if '::' in args:
        key, field = args.split('::')
    else:
        key = args
        field = None

    if isinstance(collection, dict):
        return collection[key]
    elif isinstance(collection, list):
        if field is None:
            return collection[key]
        else:
            records = [el for el in collection if el[field] == key]
            if len(records) == 0:
                return None
            elif len(records) == 1:
                return records[0]
            else:
                return records
