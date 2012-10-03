<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:block="urn:bem:block"
    xmlns:elem="urn:bem:elem"
    xmlns:mod="urn:bem:mod"
    exclude-result-prefixes=" block elem mod "
    version="1.0">

    <xsl:template match="block:b-table">
        <table class="b-table">
            <xsl:apply-templates />
        </table>
    </xsl:template>


    <xsl:template match="block:b-table/elem:row">
        <tr>
            <xsl:call-template name="elem:class" />
            <xsl:apply-templates />
        </tr>
    </xsl:template>

    <xsl:template match="block:b-table/elem:row/elem:cell">
        <td>
            <xsl:call-template name="elem:class" />
            <xsl:apply-templates />
        </td>
    </xsl:template>

</xsl:stylesheet>
